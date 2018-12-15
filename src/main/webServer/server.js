export default class webServer {
	constructor(closeCallBack, compressCallBack) {
		this.app = require('./app');
		this.http = require('http');
		this.ip = null;
		this.port = null;
		this.status = false;
		this.monitor = null;
		this.closeCallBack = closeCallBack;
		this.jobName = null;
		this.className = null;
		this.compressCallBack = compressCallBack;
		this.timestamp = null;
	}
	start(ip, port, time, jobName, className,timestamp) {
		if (!this.status) {
			this.jobName = jobName;
			this.className = className;
			this.timestamp = timestamp;
			this.ip = ip;
			this.port = port;
			this.time = time * 60 * 1000;
			this.app.set('port', this.port);
			this.server = this.http.createServer(this.app);
			this.server.listen(this.port);
			this.monitor = setTimeout(this.closeCallBack, this.time);
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
			clearTimeout(this.monitor);
			this.status = false;
			this.compressCallBack(this.jobName, this.className);
			return true;
		}
		else {
			return false;
		}
	}
	getStatus() {
		return this.status;
	}
	getAddress() {
		return this.ip + ":" + this.port + "";
	}
	getJobName() {
		return this.jobName;
	}
	getClassName() {
		return this.className;
	}
	getTimestamp() {
		return this.timestamp;
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
