
/**
 * Module dependencies.
 */
// Default
var express = require('express');
var routes = require('./routes');
var team = require('./routes/team');
var http = require('http');
var path = require('path');
//Mine
var secrets = require('./config/secrets');
var mongo = require('mongoskin');
var db = mongo.db(secrets.db, {native_parser:true});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public2', express.static(path.join(__dirname, 'bower_components')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// GETs
app.get('/', routes.index);
app.get('/teams', team.teamlist(db));
app.post('/addteam', team.addteam(db));
app.delete('/deleteteam/:id', team.deleteteam(db));
// Kick it up!
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
