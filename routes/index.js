var async = require('async'),
	refresh = require(__dirname +'/refresh.js'),
	monk = require('monk'),
    db = monk('mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/');

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