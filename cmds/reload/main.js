const c = module.exports = {};
c.settings = require('./settings.json');
c.process = async (bot, msg, cmdArgs, guild, user, config, u) => {
    u.loader.reloadCommands();
    bot.createMessage(msg.channel.id, '✅ Reloaded commands and utils.');
}
