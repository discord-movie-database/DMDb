const c = module.exports = {};
c.settings = {
    "restricted": false,
    "hidden": false,
    "usage": "Title Name OR IMDb ID",
    "description": "Get information on a title based on name or IMDb ID.",
    "large_description": "Get detailed information about a certain title.\n\nYou can use flags for advanced usage:\nYear: `-y` or `--year`\n\nExamples:\n`!?title life -y 2017`\n`!?title life --year 2017`"
};

c.process = async (bot, msg, cmdArgs, guild, user, config, u) => {
    let flags = u.f.main(cmdArgs, ['year']);
    let year = flags.year || '';
    let argsJoin = flags.args.join(' ').toLowerCase();

    if (!cmdArgs[0]) return bot.createMessage(msg.channel.id, '❌ Title name or IMDb ID required.');

    let message = await bot.createMessage(msg.channel.id, `ℹ Getting information for the title '**${argsJoin}**'...`);

    let title;

    for (let i = 0; i < cache.titles.length; i++) {
        if (cache.titles[i].terms.indexOf(argsJoin) > -1) title = cache.titles[i];

        console.log('Dev: Title cache item: ' + i);
    }

    if (!title) {
        title = await u.api.getTitle(argsJoin, year);
        if (title.Response && title.Response === 'False') return message.edit('❌ No results found.');
        if (title.Error) return (`❌ ${title.Error}`);

        title.terms = [argsJoin];
        cache.titles.push(title);
        console.log('Dev: Added new title to cache.');
    } else {
        console.log('Dev: Title was already in cache.');
        console.log(cache);
    }

    let poster = title.Poster;
    let boxOffice = title.BoxOffice || 'N/A';
    let website = title.Website || 'N/A';
    if (website !== 'N/A') website = await u.api.shortUrl(website);
    if (title.Poster === 'N/A') poster = '';
    
    message.edit({embed: {
        title: title.Title,
        description: title.Plot,
        fields: [{
            name: 'Released', // 1
            value: title.Released,
            inline: true
        }, {
            name: 'Runtime', // 2
            value: title.Runtime,
            inline: true
        }, {
            name: 'Rated', // 3
            value: title.Rated,
            inline: true
        }, {
            name: 'Genre', // 4
            value: title.Genre,
            inline: true
        }, {
            name: 'Type', // 5
            value: title.Type.charAt(0).toUpperCase() + title.Type.slice(1),
            inline: true
        }, {
            name: 'Country', // 6
            value: title.Country,
            inline: true
        }, {
            name: 'Language', // 7
            value: title.Language,
            inline: true
        }, {
            name: 'Awards', // 8
            value: title.Awards,
            inline: true
        }, {
            name: 'Director', // 9
            value: title.Director,
            inline: true
        }, {
            name: 'Writer', // 10
            value: title.Writer,
            inline: true
        }, {
            name: 'Actors', // 11
            value: title.Actors,
            inline: true
        }, {
            name: 'Website', // 13
            value: website,
            inline: true
        }, {
            name: 'Box Office', // 12
            value: boxOffice,
            inline: true
        }, {
            name: 'Metascore', // 14
            value: title.Metascore,
            inline: true
        }, {
            name: 'Rating', // 15
            value: `${title.imdbRating}`,
            inline: true
        }, {
            name: 'Votes', // 16
            value: title.imdbVotes,
            inline: true
        }, {
            name: 'IMDb ID', // 17
            value: title.imdbID,
            inline: true
        }],
        color: 0xE6B91E,
        url: `http://www.imdb.com/title/${title.imdbID}/`,
        thumbnail: {
            url: poster
        }
    },
    "content": ""}).catch((err) => {
        message.edit('❌ There was an error with the embed. Try a different movie or try again later.');
        
        console.error(err);
    });
}