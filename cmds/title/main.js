const superagent = require('superagent');
const c = module.exports = {};
c.settings = require('./settings.json');
c.process = async (bot, msg, cmdArgs) => {
    let argsJoin = cmdArgs.join(' ');
    if (!cmdArgs[0]) return bot.createMessage(msg.channel.id, '❌ Title name or IMDb ID required.');
    var type = 't';
    if (argsJoin.startsWith('tt')) type = 'i';
    let message = bot.createMessage(msg.channel.id, `ℹ Getting information for the title '${argsJoin}'...`);
    let title = await superagent.get(`http://svr2.omdbapi.com/?${type}=${argsJoin}&plot=short&r=json`);
    if (title.Response === "False") return message.edit('❌ No results found.');
    message.edit({embed: {
        title: title.Title,
        description: title.Plot,
        fields: [{
            name: 'Released',
            value: title.Released,
            inline: true
        }, {
            name: 'Runtime',
            value: title.Runtime,
            inline: true
        }, {
            name: 'Rated',
            value: title.Rated,
            inline: true
        }, {
            name: 'Genre',
            value: title.Genre,
            inline: true
        }, {
            name: 'Type',
            value: title.Type,
            inline: true
        }, {
            name: 'Country',
            value: title.Country,
            inline: true
        }, {
            name: 'Language',
            value: title.Language,
            inline: false
        }, {
            name: 'Awards',
            value: title.Awards,
            inline: false
        }, {
            name: 'Director',
            value: title.Director,
            inline: false
        }, {
            name: 'Writer',
            value: title.Writer,
            inline: false
        }, {
            name: 'Actors',
            value: title.Actors,
            inline: false
        }, {
            name: 'Metascore',
            value: title.Metascore,
            inline: true
        }, {
            name: 'Rating',
            value: title.imdbRating,
            inline: true
        }, {
            name: 'Votes',
            value: title.imdbVotes,
            inline: true
        }, {
            name: 'IMDb ID',
            value: title.imdbID,
            inline: true
        }],
        color: 0xE6B91E,
        url: `http://www.imdb.com/title/${title.imdbID}/`
    }});
}
