const c = module.exports = {};
c.settings = {
    "restricted": false,
    "hidden": true,
    "description": "Shard information.",
    "large_description": "Lists shards with their latency. Used for testing."
};

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