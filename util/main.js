const commands = require('./commands.js');
const db = require('./db.js');
const api = require('./api.js');
const ah = require('./argHandler.js');
const u = module.exports = {};

u.commands = commands;
u.db = db;
u.api = api;
u.ah = ah;