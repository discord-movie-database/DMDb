const fs = require('fs');

const c = module.exports = {};
c.settings = {
    "restricted": false,
    "hidden": false,
    "usage": "Page Number",
    "description": "List of best rated titles.",
    "large_description": "Get a list of the best 250 rated titles on IMDb."
};
c.top = require('../top.json');
c.reload = () => delete require.cache[require.resolve(`../top.json`)];

c.process = async (bot, msg, cmdArgs, guild, user, config, u) => {
    const message = await bot.createMessage(msg.channel.id, 'ℹ Getting information...');

    const titles = c.top.titles;
    const page = (cmdArgs[0] - 1) || 0;

    const pages = [];
    for (let i = 0; i < titles.length; i += 10) pages.push(titles.slice(i, i + 10));

    const results = pages[page];
    if (!results) return message.edit('❌ Page not found.');

    let fields = [];
    for (let i = 0; i < results.length; i++) {

        fields.push({
            name: `${results[i].name}`,
            value: `${results[i].index + 1} **|** **${results[i].rating}** **|** ${results[i].year} **|** ${results[i].id}`,
            inline: false
        });
    }
    
    message.edit({embed: {
        title: `Top Rated Titles`,
        description: `Showing **${results.length}** results out of **${titles.length}** at page **${page + 1}**.`,
        fields: fields,
        color: 0xE6B91E,
        footer: {
            text: `Information Updated: ${new Date(c.top.timeOfScrape).toString()}.`
        }
    }, content: ''});
}