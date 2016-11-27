var app = require('express')();
var http = require('http').Server(app);
var uuid = require('hat')
var io = require('socket.io')(http)

var port = 8000
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/whiteboard.html');
});

var clients = []
io.on('connection', function(socket){
  var id = uuid()
  clients.push(id)
  console.log(id + ' connected');
  socket.broadcast.emit('join', id)
  var initmsg = {
 clickX: clickX,
 clickY: clickY,
 clickDrag: clickDrag
}
  socket.emit('stateUpdateServer', initmsg)
    socket.on('disconnect', function(){
    console.log(id + ' disconnected');
  });
      socket.on('stateUpdate', function(msg){
      	msg.id = id
        clickX = msg.clickX;
        clickY = msg.clickY;
        clickDrag = msg.clickDrag;
      	socket.broadcast.emit('stateUpdateServer', msg)
    console.log('message: ' + msg);
  });
        socket.on('clear', function(){
          clickX = [];
          clickY = [];
          clickDrag = [];
          var clrmsg = {
         clickX: clickX,
         clickY: clickY,
         clickDrag: clickDrag
        }
        socket.broadcast.emit('stateUpdateServer', clrmsg)
  });
});

http.listen(port, function(){
  console.log('listening on *:'+port);
});
