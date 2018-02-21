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
    
    let title = await u.api.getTitle(argsJoin, year);
    if (title.Response && title.Response === 'False') return message.edit('❌ No results found.');
    if (title.Error) return (`❌ ${title.Error}`);

    let posterRes = title.Poster;
    if (posterRes === 'N/A') return message.edit('❌ No poster available for this title.');

    let shortUrl = await u.api.shortUrl(posterRes);
    if (shortUrl.Error) message.edit(`${posterRes} *There was an issue with the bit.ly API so we couldn't shorten the url for you.*`);

    message.edit(shortUrl.url);
}