const c = module.exports = {};
c.settings = require('./settings.json');
c.process = async (bot, msg, cmdArgs, guild, user, config, u) => {
    let fields = [];
    bot.shards.forEach((shard) => {
        fields.push({name: shard.id, value: `Status: ${shard.status}\nLatency: ${shard.latency}`, inline: true});
    });
    bot.createMessage(msg.channel.id, {embed: {
        fields: fields,
        color: 0xE6B91E
    }});
}
