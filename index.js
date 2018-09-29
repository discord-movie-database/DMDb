const Eris = require('eris');

const LoadHandler = require('./handlers/loadHandler');
const LogHandler = require('./handlers/logHandler');
const EmbedHandler = require('./handlers/embedHandler');
const APIHandler = require('./handlers/apiHandler');
const ListHandler = require('./handlers/listHandler');

class Client extends Eris {
    constructor(config) {
        super(config.tokens.discord[process.argv[2] || 'dev'],
            config.options.client);
        this.config = config;

        this.prefix = this.config.options.bot.prefix;

        this.commands = new Array();
        this.events = new Array();
        this.handlers = new Object();
        
        this.handlers.log = new LogHandler(this);
        this.handlers.embed = new EmbedHandler(this);
        this.handlers.api = new APIHandler(this);
        this.handlers.load = new LoadHandler(this);
        this.handlers.list = new ListHandler(this);

        this.loaded = false;
        this.on('ready', () => this.handlers.load.start());
    }
}

const DMDb = new Client(require('./config.json'));
DMDb.connect();