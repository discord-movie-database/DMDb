const commands = require('./commands.js');
const db = require('./db.js');
const api = require('./api.js');
const f = require('./flag.js');
const u = module.exports = {};

u.commands = commands;
u.db = db;
u.api = api;
u.f = f;