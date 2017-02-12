const c = module.exports = {};
c.settings = require('./settings.json');
c.process = async (bot, msg) => {
    let time = process.hrtime();
    bot.createMessage(msg.channel.id, '**Pong**').then(message => {
        let diff = Math.round(process.hrtime(time)[1] / 1000000);
        message.edit(`**Pong** ${diff}ms`);
    });
}
