const http = require('http');

class ServerHandler {
    constructor(base) {
        this.base = base;

        this.port = this.base.config.vote.port;
        this.auth = this.base.config.vote.auth;
    }

    create() {
        console.log('Creating vote server...');

        try {
            this.base.server = http.createServer();
            this.base.server.listen(this.port);
        } catch (err) { throw err; }
        this.base.server.on('request', this._onRequest.bind(this));

        console.log(`Created vote server on port ${this.port}`);
    }

    _onRequest(req, res) {
        if (req.method !== 'POST') return res.end();
        if (req.headers['authorization'] !== this.auth) return res.end();

        req.on('data', this._onData.bind(this));

        res.end();
    }

    _onData(data) {
        data = JSON.parse(data);
        data.time = new Date();

        this.base.handlers.db.update(data.user, {
            voted: data.time });

        console.log(`[${data.time.toISOString()}] ${data.user} voted`);
    }
}

module.exports = ServerHandler;