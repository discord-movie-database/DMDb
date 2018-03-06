const db = module.exports = {};

const r = require('rethinkdbdash')({
    host: config.db.host,
    port: config.db.port,
    db: 'imdb'
});

db.r = r;

db.getGuild = async (id) => {
    return await r.table('guilds').get(id).run();
}
db.createGuild = async (id) => {
    return await r.table('guilds').insert({"id": id}).run();
}
db.updateGuild = async (id, data) => {
    return await r.table('guilds').get(id).update(data).run();
}

db.getUser = async (id) => {
    return await r.table('users').get(id).run();
}
db.createUser = async (id) => {
    return await r.table('users').insert({"id": id}).run();
}
db.updateUser = async (id, data) => {
    return await r.table('users').get(id).update(data).run();
}

/* db.getStats = async (count) => {
    return await r.table('stats').slice().sort((a, b) => {
        return a.time - b.time;
    });
}
db.updateStats = async (data) => {
    return await r.table('stats').insert(data).run();
} */