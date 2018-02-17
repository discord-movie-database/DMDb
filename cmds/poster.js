const c = module.exports = {};
c.settings = {
    "restricted": false,
    "hidden": false,
    "usage": "Title Name OR IMDb ID",
    "description": "Get a poster based on name or IMDb ID.",
    "large_description": "Get just the poster for a title.\n\nYou can use flags for advanced usage:\nYear: `-y` or `--year`\n\nExamples:\n`!?poster Life -y 2017`\n`!?poster Gravity --year 2013`"
};

c.process = async (bot, msg, cmdArgs, guild, user, config, u) => {
    let flags = u.f.main(cmdArgs, ['year']);
    let year = flags.year || '';
    let argsJoin = flags.args.join(' ');

    if (!cmdArgs[0]) return bot.createMessage(msg.channel.id, '❌ Title name or IMDb ID required.');

    let message = await bot.createMessage(msg.channel.id, `ℹ Getting poster for the title '**${argsJoin}**'...`);
    
    let poster = await u.api.getPoster(argsJoin, year);
    if (poster.Response && poster.Response === 'False') return message.edit('❌ No results found.');
    if (poster.Error) return (`❌ ${poster.Error}`);

    let posterRes = poster.Poster;
    if (posterRes === 'N/A') return message.edit('❌ No poster available for this title.');

    let shortUrl = await u.api.shortUrl(posterRes) || `${posterRes} *There was an issue with the bit.ly API so we couldn't shorten the url for you.*`;
    message.edit(shortUrl);
}