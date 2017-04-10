const u = require('../../util/main.js');
const c = module.exports = {};
c.settings = require('./settings.json');
c.process = async (bot, msg, cmdArgs) => {
    if (cmdArgs[0]) {
        let reload = l.loader.reloadCommand();
        if (reload.err) return bot.createMessage(msg.channel.id, `❌ ${cmdArgs[0]}`);
        bot.createMessage(msg.channel.id, reload.msg);
        return;
    }
    u.loader.reloadCommands();
    bot.createMessage(msg.channel.id, 'Reloaded commands.');
}
