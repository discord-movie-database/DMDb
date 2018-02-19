const c = module.exports = {};
c.settings = {
    "restricted": false,
    "hidden": false,
    "usage": "Title Name",
    "description": "Find multiple titles based on a search term.",
    "large_description": "Get a list of titles based on a search term.\n\nYou can use flags for advanced search.\nPage: `-p` or `--page`\nYear: `-y` or `--year`\n\nExamples:\n`!?search Spiderman -y 2010 -p 2`\n`!?search Maze Runner --year 2010 --page 2`"
};

c.process = async (bot, msg, cmdArgs, guild, user, config, u) => {
    let flags = u.f.main(cmdArgs, ['year', 'page']);
    let year = flags.year || '';
    let page = flags.page || 1;
    let argsJoin = flags.args.join(' ');

    if (!cmdArgs[0]) return bot.createMessage(msg.channel.id, '❌ Search term required.');
    let message = await bot.createMessage(msg.channel.id, `ℹ Searching for titles with the term '**${argsJoin}**'...`);
    
    const search = await u.api.searchTitles(argsJoin, year, page);
    if (search.Response && search.Response === 'False') return message.edit('❌ No results found.');
    if (search.Error) return (`❌ ${search.Error}`);

    let fields = [];
    for (let i = 0; i < search.Search.length; i++) {
        let type = search.Search[i].Type;

        fields.push({
            name: search.Search[i].Title,
            value: `${search.Search[i].Year} **|** ${type[0].toUpperCase() + type.slice(1)} **|** ${search.Search[i].imdbID}`,
            inline: false
        });
    }

    if (year.length > 0) year = ` in the year **${year}**`;
    
    message.edit({embed: {
        title: argsJoin[0].toUpperCase() + argsJoin.slice(1),
        description: `Showing **${search.Search.length}** results out of **${search.totalResults}** at page **${page}**${year}.\n*To learn how to change the page use the command \`!?help search\`.*`,
        fields: fields,
        color: 0xE6B91E
    }, "content": ""}).catch((err) => {
        message.edit('❌ There was an error with the embed. Try a different movie or try again later.');
        
        console.error(err);
    });
}