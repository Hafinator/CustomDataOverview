const Influx = require('influx')
const express = require('express')
const http = require('http')
const os = require('os')

const app = express()

const influx = new Influx.InfluxDB({
	host: 'localhost',
	database: 'letni1',
	schema: [
		{
			measurement: 'metering',
			fields: {
				path: Influx.FieldType.STRING,
				duration: Influx.FieldType.INTEGER
			},
			tags: [
				'host'
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

		influx.writePoints([
			{
				measurement: 'metering',
				tags: { host: os.hostname() },
				fields: { duration, path: req.path },
			}
		]).catch(err => {
			console.error(`Error saving data to InfluxDB! ${err.stack}`)
		})
	})
	return next()
})

//app.get('/', function (req, res) {
//	setTimeout(() => res.end('Hello world!'), Math.random() * 500)
//})

app.get('/times', function (req, res) {
	influx.query(`
    select * from metering
  `).then(result => {
			res.json(result)
		}).catch(err => {
			res.status(500).send(err.stack)
		})
})