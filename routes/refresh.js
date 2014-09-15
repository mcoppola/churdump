var async = require('async'),
	Spreadsheet = require('edit-google-spreadsheet'),
	monk = require('monk'),
    db = monk('mongodb://heroku_app29188108:pk8moq7fsn9r02c2al0l25iahp@ds035260.mongolab.com:35260/heroku_app29188108');
    data = {};

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
	        data = {};
	        data.name = 'hours';

	        data.monday = rows['2']['2'];
	        data.tuesday = rows['3']['2'];
	        data.wednesday = rows['4']['2'];
	        data.thursday = rows['5']['2'];
	        data.friday = rows['6']['2'];
	        data.saturday = rows['7']['2'];
	        data.sunday = rows['8']['2'];

	        data.weekOf = rows['10']['2'];

	        callback(null);
	    });

	});	
}

var addToDb = function (callback, err) {

	// Set our collection
    var collection = db.get('hours');

    // Submit to the DB
    collection.find({name: 'hours'}, function(err, doc) {
    	if (!doc.length) {
    		collection.insert(data, function(err, results) {
    			if (err) {
		            // If it failed, return error
		            callback(err, { res: 'data update not successful!'});
		        }
		        else {
		            callback(null, { res: 'data update successful!'});
		        }
    		});
    	} else {
    		collection.update({name: 'hours'}, data, function (err, resuts) {
		        if (err) {
		            // If it failed, return error
		            callback(err, { res: 'data update not successful!'});
		        }
		        else {
		            callback(null, { res: 'data update successful!'});
		        }

		    });
    	}
    })

    
}

var refresh = function (req, res) {

    async.series([ getSpreadsheetData, addToDb ], function(err, results) {
		res.render('refresh', { data: results[1] });
	});

};

module.exports = refresh;