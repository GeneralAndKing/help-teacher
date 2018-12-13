export default class webServer {
	constructor(callBack) {
		this.app = require('./app');
		this.http = require('http');
		this.port = null;
		this.status = false;
		this.monitor = null;
		this.callBack = callBack;
	}
	start(port, time) {
		if (!this.status) {
			this.port = port;
			this.time = time;
			this.app.set('port', this.port);
			this.server = this.http.createServer(this.app);
			this.server.listen(this.port);
			this.monitor = setTimeout(this.callBack, this.time);
			this.status = true;
			return true;
		}
		else {
			return false;
		}

	}
	stop() {
		if (this.status) {
			this.server.close();
			window.clearTimeout(this.monitor);
			this.monitor = null;
			this.status = false;
		}
		else {
			return false;
		}
	}
	getStatus() {
		return this.status;
	}
	getPort() {
		return this.port;
	}
	getTime() {
		return this.time;
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
