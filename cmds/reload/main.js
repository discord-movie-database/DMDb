const u = require('../../util/main.js');
const c = module.exports = {};
c.settings = require('./settings.json');
c.process = async (bot, msg, cmdArgs) => {
    u.loader.reloadCommands();
    bot.createMessage(msg.channel.id, '✅ Reloaded commands and utils.');
}
