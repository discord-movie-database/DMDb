const u = require('../../util/main.js');
const c = module.exports = {};
c.settings = require('./settings.json');
c.process = async (bot, msg) => {
    let apiPing = process.hrtime();
    let apiRequest = await u.api.getTitle((Math.round(Math.random() * 9999) + 1).toString());
    apiPing = Math.round(process.hrtime(apiPing)[1] / 1000000);
    let discordPing = process.hrtime();
    bot.createMessage(msg.channel.id, 'ℹ Pinging...').then(message => {
        discordPing = Math.round(process.hrtime(discordPing)[1] / 1000000);
        message.edit({embed: {
            fields: [{
                name: 'Discord',
                value: `${discordPing}ms`,
                inline: true
            }, {
                name: 'API 1',
                value: `${apiPing}ms`,
                inline: true
            }],
            color: 0xE6B91E
        }});
    });
}
