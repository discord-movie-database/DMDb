const c = module.exports = {};
c.settings = require('./settings.json');
c.process = async (bot, msg) => {
    let result = '__**Shards**__\n';
    bot.shards.forEach((shard) => {
        result += `\n[**${shard.id}**] Status: ${shard.status}. Latency: ${shard.latency}.`
    });
    bot.createMessage(msg.channel.id, result);
}
