const c = module.exports = {};
c.settings = {
    "restricted": true,
    "hidden": true,
    "description": "Reload the every command for IMDb.",
    "large_description": "Reload commands and handlers after an update instead of restarting bot."
};

c.process = async (bot, msg, cmdArgs, guild, user, config, u) => {
    u.loader.reloadCommands();

    bot.createMessage(msg.channel.id, '✅ Reloaded commands and utils.');
}