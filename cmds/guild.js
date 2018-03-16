const c = module.exports = {};
c.settings = {
    "restricted": false,
    "hidden": true,
    "description": "Get current guild configuration.",
    "large_description": "Get web panel configuration of the guild."
};

c.process = async (bot, msg, cmdArgs, guild, user, config, u) => {
    if (!guild) return bot.createMessage(msg.channel.id, '❌ Not in guild.');

    bot.createMessage(msg.channel.id, {
        embed: {
            title: 'Guild Configuration',
            description: 'You can change these settings at the web panel: <https://dmdb.me/panel>.',
            fields: [
                {
                    name: 'Prefix',
                    value: guild.prefix || `${config.prefix} *(default)*`,
                    inline: true
                }
            ],
            color: 0xE6B91E
        }
    });
}