const c = module.exports = {};
c.settings = {
    "restricted": false,
    "hidden": false,
    "usage": "Title Name OR IMDb ID",
    "description": "Get a poster based on name or IMDb ID.",
    "large_description": "Get just the poster for a title.\n\nYou can use flags for advanced usage:\nYear: `-y` or `--year`\n\nExamples:\n`!?poster Life -y 2017`\n`!?poster Gravity --year 2013`"
};

c.process = async (bot, msg, cmdArgs, guild, user, config, u) => {
    const flags = u.f.main(cmdArgs, ['year']);
    const year = flags.year || '';
    const argsJoin = flags.args.join(' ');

    if (!cmdArgs[0]) return bot.createMessage(msg.channel.id, '❌ Title name or IMDb ID required.');
    const message = await bot.createMessage(msg.channel.id, `ℹ Getting poster for the title '**${argsJoin}**'...`);
    
    const title = await u.api.getTitle(argsJoin, year);
    if (title.Response === 'False') return message.edit(`❌ ${title.Error}`);
    if (title.Error) return (`❌ ${title.Error}`);

    const posterRes = title.Poster;
    if (posterRes === 'N/A') return message.edit('❌ No poster available for this title.');

    const shortUrl = await u.api.shortUrl(posterRes);
    if (shortUrl.Error) return message.edit(posterRes);

    message.edit(`${shortUrl.data.url}`);
}