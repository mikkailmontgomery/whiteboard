var http = require('http')
var url = require('url')
var fs = require('fs')
var path = require('path')
var baseDirectory = __dirname   // or whatever base directory you want

var port = 8000
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();

http.createServer(function (request, response) {
   try {
     var requestUrl = url.parse(request.url)
		 if(requestUrl.pathname == "/"){
			 requestUrl.pathname = "/whiteboard.html"
		 }
     // need to use path.normalize so people can't access directories underneath baseDirectory
     var fsPath = baseDirectory+path.normalize(requestUrl.pathname)
		 console.log(fsPath) //looking for a way to make a default document
     response.writeHead(200)
     var fileStream = fs.createReadStream(fsPath)
     fileStream.pipe(response)
     fileStream.on('error',function(e) {
         response.writeHead(404)     // assume the file doesn't exist
         response.end()
     })
   } catch(e) {
     response.writeHead(500)
     response.end()     // end the response so browsers don't hang
     console.log(e.stack)
   }
}).listen(port)

console.log("listening on port "+port)

var uuid = require('hat')
var iohttp = require('http')
var iohttpserver = iohttp.createServer(function(request,response){})
var io = require('socket.io')(iohttpserver)
var clients = []
io.on('connection', function(socket){
  var id = uuid()
  clients.push(id)
  console.log(id + ' connected');
  socket.broadcast.emit('join', id)
    socket.on('disconnect', function(){
    console.log(id + ' disconnected');
  });
      socket.on('stateUpdate', function(msg){
      	msg.id = id
      	socket.broadcast.emit('stateUpdateServer', msg)
    console.log('message: ' + msg);
  });
});


iohttpserver.listen(8080)

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");
