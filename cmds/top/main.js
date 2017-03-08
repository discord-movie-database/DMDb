const fs = require('fs');
const u = require('../../util/main.js');

const pageResults = async (top, page, callback) => {
    callback(top.splice(page * 10, 10));
}

const c = module.exports = {};
c.settings = require('./settings.json');
c.process = async (bot, msg, cmdArgs, guild, user) => {
    let message = await bot.createMessage(msg.channel.id, 'ℹ Getting information...');
    let top = require('./top.json');
    let page = (cmdArgs[0] - 1) || 0;
    let pages = (top.length / 10) || 0;
    let results = top.slice(page * 10, 10);
    let response = '';
    for (let i = 0; i < results.length; i++) {
        response += `\n[**${results[i].num + 1}**] ${results[i].name} *(${results[i].year})* **${results[i].rating}** *${results[i].id}*`;
    }
    message.edit({embed: {
        title: 'Top Rated Titles',
        description: `**Page: ${page + 1}/${pages}**\n${response}`,
        color: 0xE6B91E
    }});
}
