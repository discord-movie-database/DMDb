const EventEmitter = require('events').EventEmitter;

const DBHandler = require('./dbHandler');
const ServerHandler = require('./serverHandler');

class VoteServer extends EventEmitter {
    constructor(config) {
        super();

        this.config = config;

        this.db;
        this.server;

        this.handlers = {};
        this.handlers.db = new DBHandler(this);
        this.handlers.server = new ServerHandler(this);
    }

    start() {
        this.handlers.db.connect();
        this.on('db', () => this.handlers.server.create());
    }
}

const config = require('../config.json');
const voteServer = new VoteServer(config);

voteServer.start();
