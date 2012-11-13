
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , darksky = require('darksky')
  , hbs = require('hbs');

var client = new darksky.Client('e066bcbb91c006d61d030057f4f933a0');

var gm = require('googlemaps');
var util = require('util');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 8080);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hbs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//app.get('/', routes.index);
app.get('/users', user.list);
app.get('/', function(request, response) {
	response.render("index");
});

hbs.registerPartial('darkskyrpl', darksky); 

app.get('/ajax/location/lat/:lat/long/:long', function(request, response){
	var lat = request.params.lat;
	var long = request.params.long;

//	gm.reverseGeocode(lat+','+long, function(err, data){
//		response.send(data);
//		response.render("darksky", {"forecast":data});
//	});
	client.forecast(lat, long, function(err, data) { 
		console.log(JSON.parse(data));
		response.send(JSON.parse(data));
	});
	
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
