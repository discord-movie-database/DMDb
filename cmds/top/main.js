const fs = require('fs');
const c = module.exports = {};
c.settings = require('./settings.json');
c.process = async (bot, msg, cmdArgs, guild, user, config, u) => {
    let message = await bot.createMessage(msg.channel.id, 'ℹ Getting information...');
    let top = require('./top.json');
    let page = (cmdArgs[0] - 1) || 0;
    let pages = [];
    for (let i = 0; i < top.length; i += 10) pages.push(top.slice(i, i + 10));
    let results = pages[page];
    if (!results) return message.edit('❌ Page not found.');
    let response = '';
    for (let i = 0; i < results.length; i++) response += `\n[**${results[i].num + 1}**] ${results[i].name} *(${results[i].year})* **${results[i].rating}** *${results[i].id}*`;
    message.edit({embed: {
        title: 'Top Rated Titles',
        description: `**Page: ${page + 1}/${pages.length}**\n${response}`,
        color: 0xE6B91E
    }});
}
