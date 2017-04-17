const c = module.exports = {};
c.settings = require('./settings.json');
c.process = async (bot, msg, cmdArgs, guild, user, config, u) => {
    let apiPing = new Date().getTime();
    let apiRequest = await u.api.getTitle((Math.round(Math.random() * 9999) + 1).toString());
    apiPing = new Date().getTime() - apiPing;
    
    let discordPing = new Date().getTime();
    let message = await bot.createMessage(msg.channel.id, 'Pinging...');
    discordPing = new Date().getTime() - discordPing;
    
    let shardPing = '-';
    if (msg.channel.guild) shardPing = msg.channel.guild.shard.latency + 'ms';
    
    message.edit({embed: {
        fields: [{
            name: 'Pong!',
            value: `${discordPing}ms`,
            inline: true
        }, {
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
