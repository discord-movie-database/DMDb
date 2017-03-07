const c = module.exports = {};
c.settings = require('./settings.json');
c.process = async (bot, msg, cmdArgs) => {
    let argsJoin = cmdArgs.join(' ');
    let evaled = eval(argsJoin);
    bot.createMessage(msg.channel.id, evaled);
}
