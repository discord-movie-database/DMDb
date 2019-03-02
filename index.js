const env = process.argv[2] || 'dev';

const Eris = require('eris');

const LoadHandler = require('./handlers/loadHandler');
const LogHandler = require('./handlers/logHandler');
const EmbedHandler = require('./handlers/embedHandler');
const APIHandler = require('./handlers/apiHandler');
const BotlistHandler = require('./handlers/botlistHandler');
const DBHandler = require('./handlers/dbHandler');
const UtilHandler = require('./handlers/utilHandler');
const BotHandler = require('./handlers/botHandler');

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

        this.commands = new Array();
        this.events = new Array();
        this.handlers = new Object();
        
        this.handlers.util = new UtilHandler(this);
        this.handlers.log = new LogHandler(this);
        this.handlers.embed = new EmbedHandler(this);
        this.handlers.api = new APIHandler(this);
        this.handlers.db = new DBHandler(this);
        this.handlers.load = new LoadHandler(this);
        this.handlers.botlist = new BotlistHandler(this);
        this.handlers.bot = new BotHandler(this);

        this.handlers.log.info('Connecting to Discord');
        this.on('ready', () => this.handlers.load.start());
    }
}

const DMDb = new Client(require('./config.json'));
DMDb.connect();