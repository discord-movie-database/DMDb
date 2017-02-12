const superagent = require('superagent');
const c = module.exports = {};
c.settings = require('./settings.json');
c.process = async (bot, msg) => {
    bot.createMessage(msg.channel.id, {embed: {
        author: {
            name: "IMDb"
        },
        description: "Get information on your favourite movies, series and celebrities from IMDb.",
        fields: [{
            name: 'Level',
            value: '1',
            inline: true
        }, {
            name: 'Rank',
            value: '#35433',
            inline: true
        }, {
            name: 'Experience',
            value: '0.0334',
            inline: true
        }, {
            name: 'Watchlist',
            value: '216',
            inline: true
        }, {
            name: 'Badges',
            value: '123 123 123 123 123 123 123',
            inline: false
        }],
        color: 0xE6B91E,
        footer: {
            text: "Developed by DumplingsWithToads | Patreon"
        }
    }});
}
