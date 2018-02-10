const c = module.exports = {};
c.settings = {
    "restricted": true,
    "hidden": true,
    "description": "Reload the every command for IMDb.",
    "large_description": "Unload every command and load them again when changes are made to a command."
};

c.process = async (bot, msg, cmdArgs, guild, user, config, u) => {
    u.loader.reloadCommands();

    bot.createMessage(msg.channel.id, '✅ Reloaded commands and utils.');
}