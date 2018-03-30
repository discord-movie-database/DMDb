const loader = require('./loader.js');
const db = require('./db.js');
const api = require('./api.js');
const flag = require('./flag.js');
const stats = require('./stats.js');
const scrape = require('./scrape.js');
const log = require('./log.js');
const embed = require('./embed.js');

const u = module.exports = {};

u.loader = loader;
u.db = db;
u.api = api;
u.f = flag;
u.stats = stats;
u.scrape = scrape;
u.log = log;
u.embed = embed;