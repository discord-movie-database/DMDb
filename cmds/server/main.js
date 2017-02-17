const c = module.exports = {};
c.settings = require('./settings.json');
c.process = async (bot, msg) => {
    bot.createMessage(msg.channel.id, 'http://discord.gg/u7rBbQa');
}
