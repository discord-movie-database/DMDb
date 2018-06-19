const c = module.exports = {};
c.settings = {
    "restricted": false,
    "hidden": false,
    "usage": "IMDb ID",
    "description": "Get a poster based on IMDb ID.",
    "large_description": "Get just the poster for a title in **HD**. You can only use the title's IMDb ID for this command."
};

c.process = async (bot, msg, cmdArgs, guild, user, config, u) => {
    if (!cmdArgs[0]) return bot.createMessage(msg.channel.id, '❌ IMDb ID required.');

    let message = await bot.createMessage(msg.channel.id, `ℹ Getting HD poster for the title with IMDb ID '**${cmdArgs[0]}**'...`);
    
    let poster = await u.api.getHDPoster(cmdArgs[0]);
    if (!poster || poster && poster.Error) return message.edit(`❌ ${poster.Error || 'Uknown Error.'}`);

    message.delete();
    bot.createMessage(msg.channel.id, '', {
        'file': poster,
        'name': cmdArgs[0] + '.png'
    });
}