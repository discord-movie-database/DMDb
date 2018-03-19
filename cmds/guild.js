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
            title: msg.channel.guild.name,
            description: 'Customize this guild (owner only): <https://dmdb.me/panel>',
            fields: [
                {
                    name: 'Pro',
                    value: guild.premium ? 'True' : 'False',
                    inline: true
                },
                {
                    name: 'Commands Executed',
                    value: guild.count || '-',
                    inline: true
                },
                {
                    name: 'Prefix',
                    value: guild.prefix || `${config.prefix} (Default)`,
                    inline: true
                }
            ],
            color: 0xE6B91E
        }
    });
}