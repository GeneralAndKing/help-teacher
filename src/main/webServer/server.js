export default class webServer {
	constructor() {
		this.app = require('./app');
		this.http = require('http');
		this.port = null;
		this.status = false;
	}
	start(port) {
		this.port = port;
		this.restart();
		// this.server.on('error', onError);
		// this.server.on('listening', onListening);
	}
	restart() {
		this.app.set('port', this.port);
		this.server = this.http.createServer(this.app);
		this.server.listen(this.port);
		this.status = true;
	}
	stop() {
		this.server.close();
		this.status = false;
	}
	getStatus() {
		return this.status;
	}
	getPort() {
		return this.port;
	}
}




/**
 * Module dependencies.
 */



/**
 * Get port from environment and store in Express.
 */



/**
 * Create HTTP server.
 */



/**
 * Listen on provided port, on all network interfaces.
 */



/**
 * Normalize a port into a number, string, or false.
 */


/**
 * Event listener for HTTP server "error" event.
 */

// function onError(error) {
// 	if (error.syscall !== 'listen') {
// 		throw error;
// 	}

// 	var bind = typeof port === 'string'
// 		? 'Pipe ' + port
// 		: 'Port ' + port;

// 	// handle specific listen errors with friendly messages
// 	switch (error.code) {
// 		case 'EACCES':
// 			console.error(bind + ' requires elevated privileges');
// 			process.exit(1);
// 			break;
// 		case 'EADDRINUSE':
// 			console.error(bind + ' is already in use');
// 			process.exit(1);
// 			break;
// 		default:
// 			throw error;
// 	}
// }

/**
 * Event listener for HTTP server "listening" event.
 */

// function onListening() {
// 	var addr = server.address();
// 	var bind = typeof addr === 'string'
// 		? 'pipe ' + addr
// 		: 'port ' + addr.port;
// 	debug('Listening on ' + bind);
// }
