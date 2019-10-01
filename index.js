import Eris from 'eris';

import LoadHandler from './handlers/load';
import LogHandler from './handlers/log';
import EmbedHandler from './handlers/embed';
import APIHandler from './handlers/api';
import BotlistHandler from './handlers/botlist';
import DBHandler from './handlers/db';
import UtilHandler from './handlers/util';
import StatusHandler from './handlers/status';
import StatsHandler from './handlers/stats';

class Client extends Eris {
    constructor(config) {
        super(config.tokens.discord, config.client);

        this.loaded = false;
        this.config = config;

        this.db;

        this.flags = {};

        this.commands = [];
        this.events = [];
        this.handlers = {};
        
        this.handlers.util = new UtilHandler(this);
        this.handlers.log = new LogHandler(this);
        this.handlers.embed = new EmbedHandler(this);
        this.handlers.api = new APIHandler(this);
        this.handlers.db = new DBHandler(this);
        this.handlers.load = new LoadHandler(this);
        this.handlers.botlist = new BotlistHandler(this);
        this.handlers.status = new StatusHandler(this);
        this.handlers.stats = new StatsHandler(this);

        this.handlers.log.info('Connecting to Discord');
        this.once('ready', () => this.handlers.load.start());
    }
}

const DMDb = new Client(require('./config.json'));
DMDb.connect();
