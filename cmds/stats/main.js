const c = module.exports = {};
c.settings = require('./settings.json');
c.process = async (bot, msg) => {
    let uptime = '';
    let d = new Date(bot.uptime);
    if ((d.getUTCDate() - 1) !== 0) uptime += d.getUTCDate() - 1 + ' Days, ';
    if (d.getUTCHours() !== 0) uptime += d.getUTCHours() + ' Hours, ';
    if (d.getUTCMinutes() !== 0) uptime += d.getUTCMinutes() + ' Minutes, ';
    uptime += d.getUTCSeconds() + ' Seconds ';
    let memUsage = Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB';
    bot.createMessage(msg.channel.id, {embed: {
        fields: [{
            name: 'Uptime',
            value: uptime,
            inline: true
        }, {
            name: 'Mem Usage',
            value: memUsage,
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