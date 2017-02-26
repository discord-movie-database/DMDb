const config = require('../config.json');
const superagent = require('superagent');
const e = module.exports = {};

e.main = async (count) => {
    let discordbots = await superagent.post('https://discordbots.org/api/bots/223202904385912832/stats').set({
        'Authorization': config.token.list.dbotsorg,
        'Content-Type': 'application/json'
    }).send({
        'server_count': count
    });
    let discordbots = await superagent.post('https://bots.discord.pw/api/bots/223202904385912832/stats').set({
        'Authorization': config.token.list.dbotspw,
        'Content-Type': 'application/json'
    }).send({
        'server_count': count
    });
    let carbonitex = await superagent.post(`https://www.carbonitex.net/discord/data/botdata.php`).set({
        'Content-Type': 'application/json'
    }).send({
        'key': config.token.list.carbon,
        'servercount': count
    });
}