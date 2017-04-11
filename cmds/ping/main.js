const c = module.exports = {};
c.settings = require('./settings.json');
c.process = async (bot, msg, cmdArgs, guild, user, config, u) => {
    let apiPing = process.hrtime();
    let apiRequest = await u.api.getTitle((Math.round(Math.random() * 9999) + 1).toString());
    apiPing = Math.round(process.hrtime(apiPing)[1] / 1000000);
    let shardPing = '-';
    if (msg.channel.guild) shardPing = msg.channel.guild.shard.latency + 'ms';
    bot.createMessage(msg.channel.id, {embed: {
        fields: [{
            name: 'Shard',
            value: `${shardPing}`,
            inline: true
        }, {
            name: 'API',
            value: `${apiPing}ms`,
            inline: true
        }],
        color: 0xE6B91E
    }});
}
