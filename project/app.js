//setup Dependencies
require(__dirname + "/../lib/setup").ext( __dirname + "/../lib").ext( __dirname + "/../lib/express/support");
var connect = require('connect');
var sys = require('sys');
var io = require('socket.io-node');

//Setup Express
var server = require('express').createServer();
server.configure(function(){
    server.set('views', __dirname + '/views');
    server.use(connect.bodyDecoder());
    server.use(server.router);
    server.use(connect.staticProvider(__dirname + '/static'));
});
var port = 8081;
server.listen( port);

//Setup Socket.IO
var io = io.listen(server);
io.on('connection', function(client){
	console.log('Client Connected');
	client.on('message', function(message){
		client.broadcast(message);
		client.send(message);
	});
	client.on('disconnect', function(){
		console.log('Client Disconnected.');
	});
});

console.log('Listening on http://0.0.0.0:' + port )

//setup the errors
server.error(function(err, req, res, next){
    if (err instanceof NotFound) {
        res.render('404.ejs');
    } else {
        res.render('500.ejs', { locals: { error: err } });
    }
});

//Routes
server.get('/', function(req,res){
  res.render('index.ejs', {
    locals : { 
              header: '#Header#'
             ,footer: '#Footer#'
             ,title : 'Page Title'
             ,description: 'Page Description'
             ,author: 'Your Name'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});

//Test Routes for 404 and 500 errors
server.get('/404', function(req, res){
    throw new NotFound;
});

server.get('/500', function(req, res){
    throw new Error('keyboard cat!');
});



