const loader = require('./loader.js');
const db = require('./db.js');
const api = require('./api.js');
const f = require('./flag.js');
const u = module.exports = {};

u.loader = loader;
u.db = db;
u.api = api;
u.f = f;