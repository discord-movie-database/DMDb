const c = module.exports = {};
const u = require('../../util/main.js');
c.settings = require('./settings.json');
c.process = async (bot, msg) => {
    u.commands.reloadCommands();
    bot.createMessage(msg.channel.id, "✅ Reloaded commands.");
}
