
'use strict';
var influx = require('influx');
var Schema = influx.Schema;


var TaskSchema = new Schema({
	name: {
		type: String,
		Required: 'Kindly enter the name of the task'
	},
	Created_date: {
		type: Date,
		default: Date.now
	},
	status: {
		type: [{
			type: String,
			enum: ['pending', 'ongoing', 'completed']
		}],
		default: ['pending']
	}
});

module.exports = influx.model('Tasks', TaskSchema)