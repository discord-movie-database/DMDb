const c = module.exports = {};
c.settings = require('./settings.json');
c.process = async (bot, msg) => {
    bot.createMessage(msg.channel.id, {embed: {
        author: {
            name: 'Statistics'
        },
        fields: [{
            name: 'Uptime',
            value: bot.uptime,
            inline: true
        }, {
            name: 'Mem Usage',
            value: (process.memoryUsage().heapUsed / 1000000),
            inline: true
        }, {
            name: 'Commands',
            value: Object.keys(main.commands).length,
            inline: true
        }, {
            name: 'Guilds',
            value: bot.guilds.size,
            inline: true
        }, {
            name: 'Channels',
            value: Object.keys(bot.channelGuildMap).length,
            inline: true
        }, {
            name: 'Users',
            value: bot.users.size,
            inline: true
        }],
        color: 0xE6B91E
    }});
}