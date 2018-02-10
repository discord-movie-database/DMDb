const c = module.exports = {};
c.settings = {
    "restricted": false,
    "hidden": true,
    "description": "Test the bots responsiveness.",
    "large_description": "Test the bots responsiveness by checking delay with the bot and Discord in milliseconds."
};

c.process = async (bot, msg, cmdArgs, guild, user, config, u) => {
    let discordPing = new Date().getTime();
    let message = await bot.createMessage(msg.channel.id, '**Pinging...**');
    discordPing = new Date().getTime() - discordPing;

    let apiPing = new Date().getTime();
    let apiRequest = await u.api.getTitle((Math.round(Math.random() * 9999) + 1).toString());
    apiPing = new Date().getTime() - apiPing;
    
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
    },
    "content": "**Done.**"});
}