const env = process.argv[2] || 'dev';

const Eris = require('eris');

const LoadHandler = require('./handlers/load');
const LogHandler = require('./handlers/log');
const EmbedHandler = require('./handlers/embed');
const APIHandler = require('./handlers/api');
const BotlistHandler = require('./handlers/botlist');
const DBHandler = require('./handlers/db');
const UtilHandler = require('./handlers/util');
const BotHandler = require('./handlers/bot');
const StatsHandler = require('./handlers/stats');

class Client extends Eris {
    constructor(config) {
        super(config.tokens.discord[env], config.options.client);

        this.env = env;
        this.config = config;
        this.loaded = false;

        this.db;

        this.status = {};

        this.stats = {};
        this.stats.totalUsageCount = 0;

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
        this.handlers.bot = new BotHandler(this);
        this.handlers.stats = new StatsHandler(this);

        this.handlers.log.info('Connecting to Discord');
        this.on('ready', () => this.handlers.load.start());
    }
}

const DMDb = new Client(require('./config.json'));
DMDb.connect();
