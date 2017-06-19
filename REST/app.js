'use strict';
var Influx = require('influx'),
	express = require('express'),
	http = require('http'),
	os = require('os'),
	path = require("path"),
	bodyParser = require('body-parser'),
	app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', express.static(__dirname));

const influx = new Influx.InfluxDB({
	host: 'localhost',
	database: 'letni1',
	schema: [
		{
			measurement: 'metering',
			fields: {
				VAL: Influx.FieldType.FLOAT,
				STAT: Influx.FieldType.INTEGER
			},
			tags: [
				'Device',
				'Register',
				'Storage',
				'unit'				
			]
		}
	]
})

influx.getDatabaseNames()
	.then(names => {
		if (!names.includes('letni1')) {
			return influx.createDatabase('letni1');
		}
	})
	.then(() => {
		http.createServer(app).listen(3000, function () {
			console.log('Listening on port 3000')
		})
	})
	.catch(err => {
		console.error(`Error creating Influx database!`);
	})

app.use((req, res, next) => {
	const start = Date.now()

	res.on('finish', () => {
		const duration = Date.now() - start
		console.log(`Request to ${req.path} took ${duration}ms`);

	})
	return next()
})

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/data/:from/:to/:reg/:dev/:lim', function (req, res) {
	influx.query(`
    select * from metering
	where time >= '${req.params.from}'
	and time <= '${req.params.to}'
	and Register = '${req.params.reg}'
	and Device = '${req.params.dev}'
	limit ${req.params.lim}
  `).then(result => {
			res.json(result)
		}).catch(err => {
			res.status(500).send(err.stack)
		})
})
app.get('/data/:reg', function (req, res) {
	influx.query(`
    select * from metering
	where Register = '${req.params.reg}'
	limit 10
  `).then(result => {
			res.json(result)
		}).catch(err => {
			res.status(500).send(err.stack)
		})
})
app.get('/series', function (req, res) {
	influx.query(`
show series
  `).then(result => {
			res.json(result)
		}).catch(err => {
			res.status(500).send(err.stack)
		})
})