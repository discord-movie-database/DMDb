const c = module.exports = {};
c.settings = {
    "restricted": false,
    "hidden": true,
    "usage": "Title Name or IMDb ID",
    "description": "Find similar movies.",
    "large_description": "Get a list of similar titles based on a search term."
};

c.process = async (bot, msg, cmdArgs, guild, user, config, u) => {
    const argsJoin = cmdArgs.join(' ');

    if (!cmdArgs[0]) return bot.createMessage(msg.channel.id, '❌ Title Namr or IMDb ID required.');
    const message = await bot.createMessage(msg.channel.id, `ℹ Searching for similar titles with the query '**${argsJoin}**'...`);

    const movies = await u.api.tmdb.similar(argsJoin);
    if (movies.Error) return message.edit(`❌ ${movies.Error}`);

    const fields = [];
    for (let i = 0; i < 5; i++) fields.push({
        name: movies[i].title,
        value: `*${movies[i].overview}*\n**${movies[i]['vote_average']}** **|** ${new Date(movies[i]['release_date']).getFullYear()}`,
        inline: false
    });

    u.embed.edit(message, {
        title: argsJoin[0].toUpperCase() + argsJoin.slice(1),
        desc: `Showing **5** similar results.`,
        fields: fields
    });
}