const config = require('../config.json');
const superagent = require('superagent');

const e = module.exports = {};
e.post = {};

e.post.all = async (bot) => {
    const count = bot.guilds.size;

    await e.post.dbl(count);
    // await e.post.dbots(count);
    // await e.post.carbon(count);
}

e.post.dbl = (count) => {
    const dbl = await superagent.post('https://discordbots.org/api/bots/412006490132447249/stats').set({
        'Authorization': config.token.botlist.dbl,
        'Content-Type': 'application/json'
    }).send({
        'server_count': count
    }).catch((err) => console.error(err));

    if (api.statuscode !== 200) console.log(`Cannot post new server count to dbl. (${api.statuscode})`);
}

e.post.dbots = (count) => {
    const dbots = await superagent.post('https://bots.discord.pw/api/bots/412006490132447249/stats').set({
        'Authorization': config.token.botlist.dbots,
        'Content-Type': 'application/json'
    }).send({
        'server_count': count
    }).catch((err) => console.error(err));

    if (api.statuscode !== 200) console.log(`Cannot post new server count to dbots. (${api.statuscode})`);
}

e.post.carbon = (count) => {
    const carbon = await superagent.post(`https://www.carbonitex.net/discord/data/botdata.php`).set({
        'Content-Type': 'application/json'
    }).send({
        'key': config.token.botlist.carbon,
        'servercount': count
    }).catch((err) => console.error(err));

    if (api.statuscode !== 200) console.log(`Cannot post new server count to carbon. (${api.statuscode})`);
}