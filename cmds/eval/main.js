const u = require('../../util/main.js');
const config = require('../../config.json');
const c = module.exports = {};
c.settings = require('./settings.json');
c.process = async (bot, msg, cmdArgs, guild, user, config, u) => {
    let argsJoin = cmdArgs.join(' ');
    try {
        let evaled = eval(argsJoin);
        bot.createMessage(msg.channel.id, evaled);
    } catch (err) {
        bot.createMessage(msg.channel.id, `❌ ${err}`);
    }
}