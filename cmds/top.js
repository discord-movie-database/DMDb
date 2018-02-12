const fs = require('fs');

const c = module.exports = {};
c.settings = {
    "restricted": false,
    "hidden": false,
    "usage": "Page Number",
    "description": "List of best rated titles.",
    "large_description": "Get a large list of the best 250 rated titles."
};
c.top = require('../top.json');
c.reload = () => delete require.cache[require.resolve(`../top.json`)];

c.process = async (bot, msg, cmdArgs, guild, user, config, u) => {
    let message = await bot.createMessage(msg.channel.id, 'ℹ Getting information...');

    let top = c.top;
    let page = (cmdArgs[0] - 1) || 0;
    let pages = [];
    for (let i = 0; i < top.length; i += 10) pages.push(top.slice(i, i + 10));
    let results = pages[page];
    if (!results) return message.edit('❌ Page not found.');
    let response = '';
    for (let i = 0; i < results.length; i++) response += `\n[**${results[i].index + 1}**] ${results[i].name} *(${results[i].year})* **${results[i].rating}** *${results[i].id}*`;
    
    message.edit({embed: {
        title: `Page: ${page + 1}/${pages.length}`,
        description: response,
        color: 0xE6B91E
    }, content: '**Top Rated Titles**'});
}