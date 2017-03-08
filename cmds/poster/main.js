const u = require('../../util/main.js');
const c = module.exports = {};
c.settings = require('./settings.json');
c.process = async (bot, msg, cmdArgs) => {
    let argsJoin = cmdArgs.join(' ');
    if (!cmdArgs[0]) return bot.createMessage(msg.channel.id, '❌ Title name or IMDb ID required.');
    let message = await bot.createMessage(msg.channel.id, `ℹ Getting poster for the title '${argsJoin}'...`);
    let poster = await u.api.getPoster(argsJoin);
    if (poster.Response && poster.Response === 'False') return message.edit('❌ No results found.');
    if (poster.Error) return (`❌ ${poster.Error}`);
    let posterRes = poster.Poster;
    if (posterRes === 'N/A') return message.edit('❌ No poster available for this title.');
    let shortUrl = await u.api.shortUrl(posterRes);
    message.edit(shortUrl);
}
