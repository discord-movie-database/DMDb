const config = require('../config.json');

const db = module.exports = {};

const r = require('rethinkdbdash')({
    host: config.db.host,
    port: config.db.port,
    db: 'imdb'
});

db.r = r;

db.createUser = async (id) => {
    return await r.table('users').insert({"id": id}).run();
}

db.createGuild = async (id) => {
    return await r.table('guilds').insert({"id": id}).run();
}

db.getUser = async (id) => {
    return await r.table('users').get(id).run();
}

db.getGuild = async (id) => {
    return await r.table('guilds').get(id).run();
}

db.updateUser = async (id, data) => {
    return await r.table('users').get(id).update(data).run();
}

db.updateGuild = async (id, data) => {
    return await r.table('guilds').get(id).update(data).run();
}