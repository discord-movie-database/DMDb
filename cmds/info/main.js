const c = module.exports = {};
c.settings = require('./settings.json');
c.process = async (bot, msg, cmdArgs, guild, user, config, u) => {
    let uptime = '';
    let d = new Date(bot.uptime);
    if ((d.getUTCDate() - 1) !== 0) uptime += d.getUTCDate() - 1 + ' Days, ';
    if (d.getUTCHours() !== 0) uptime += d.getUTCHours() + ' Hours, ';
    if (d.getUTCMinutes() !== 0) uptime += d.getUTCMinutes() + ' Minutes, ';
    uptime += d.getUTCSeconds() + ' Seconds ';
    let memUsage = Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB';
    let currentShard = '';
    if (msg.channel.guild) currentShard = ` (${msg.channel.guild.shard.id})`;
    bot.createMessage(msg.channel.id, {embed: {
        title: 'IMDb Information',
        description: 'Invite Bot: <http://bit.ly/inviteimdb>\nSupport Guild: <https://discord.gg/PDSsfBj>',
        fields: [{
            name: 'Developer',
            value: 'DumplingsWithToads\n#7460',
            inline: true
        }, {
            name: 'Libary',
            value: 'Eris',
            inline: true
        }, {
            name: 'Commands Executed',
            value: (main.executed + 1),
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
            name: 'Shards',
            value: config.shardCount + currentShard,
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
        }, {
            name: 'Uptime',
            value: uptime,
            inline: false
        }],
        color: 0xE6B91E
    }});
}