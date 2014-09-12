var Spreadsheet = require('edit-google-spreadsheet');
var async = require('async');

module.exports = function (app) {
    app.get('/', index);
};

var getSpreadsheetData = function(callback) {

	Spreadsheet.load({
	    debug: true,
	    spreadsheetId: '174-MA3rEijKsXfU5sifHrZ59MqEpfjmcQ6_aIjK9G3s',
	    worksheetId: 'od6',

	    oauth : {
	        email: '254154442815-4tk24uc0n66h8jn58pq9q1kgrnoc0itj@developer.gserviceaccount.com',
	        keyFile: 'key-file.pem'
	    }

	}, function sheetReady(err, spreadsheet) {

	    if (err) {
	        callback(err);
	    }

	    spreadsheet.receive(function(err, rows, info) {
	        if (err) {
	            throw err;
	        }

	        // format the data
	        var data = {};
	        console.log(rows['2']['2']);
	        data.monday = rows['2']['2'];

	        callback(null, data);
	    });

	});
	
}

var index = function (req, res) {
	// Lets get our hours and return it to the template
	async.series([ getSpreadsheetData ], function(err, results) {
			res.render('index', { data: results });
	});
    
};