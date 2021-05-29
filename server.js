// modules
const http = require('http');
const debug = require('debug')('node-angular');
const app = require('./app');

// port
const normalizePort = val => {
   const port = parseInt(val, 10);
   
   // named pipe
   if(isNaN(port)) return val;

   // port number
   if(port >= 0) return port;

   return false;
};

// error handler
const onError = error => {
   if(error.syscall !== "listen") {
      throw error;
   }

   const bind = typeof port === "string" ? "pipe " + port : "port " + port;
   switch(error.code) {
      case "EACCES":
         console.error(bind + " requires elevated privileges");
         process.exit(1);
         break;
      case "EADDRINUSE":
         console.error(bind + " is already in use");
         process.exit(1);
         break;
      default:
         throw error;
   }
};

// listening handler
const onListening = () => {
   const addr = server.address();
   const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
   debug("Listening on " + bind);
}

// setups
const port = normalizePort(process.env.PORT || "3000");
// traditional nodejs http server, replaced with express
// const server = http.createServer((req, res) => {
//    res.end('Start of a new server.');
// });

app.set('port', port);
const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);

