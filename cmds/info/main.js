const c = module.exports = {};
c.settings = require('./settings.json');
c.process = async (bot, msg) => {
    bot.createMessage(msg.channel.id, 'The IMDb Discord Bot was created by DumplingsWithToads#7460. The bots goal is to get information about movies, series and celebrities easily and fast through Discord from IMDb. The IMDb Discord Bot is not affiliated to IMDb, an Amazon company.');
}
