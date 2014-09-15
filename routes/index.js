var async = require('async'),
	refresh = require(__dirname +'/refresh.js'),
	monk = require('monk'),
    db = monk('mongodb://heroku_app29188108:pk8moq7fsn9r02c2al0l25iahp@ds035260.mongolab.com:35260/heroku_app29188108');

module.exports = function (app) {
    app.get('/', index);
    app.get('/refresh', refresh);
};


var getHoursFromDb = function(callback) {

	var collection = db.get('hours');

    // Submit to the DB
    collection.find({name: 'hours'}, function (err, results) {
    	if (err) {
    		callback(err, {});
    	}
    	callback(null, results[0]);
    });

    

}

var index = function (req, res) {
	// Lets get our hours and return it to the template
	async.series([ getHoursFromDb ], function(err, results) {
		res.render('index', { data: results[0] });
	});
    
};