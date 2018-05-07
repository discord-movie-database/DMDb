const c = module.exports = {};
c.settings = {
    "restricted": true,
    "hidden": true,
    "description": "Reload the every command for IMDb.",
    "large_description": "Reload commands and handlers after an update instead of restarting bot."
};

c.process = async (bot, msg, cmdArgs, guild, user, config, u) => {
    if (cmdArgs[0]) {
        const cmd = cmdArgs[0].toLowerCase();

        if (main.commands[cmd]) {
            u.loader.reloadCommand(cmd);

            return bot.createMessage(msg.channel.id, `✅ Reloaded the command \`${cmd}\`.`);
        } else {
            return bot.createMessage(msg.channel.id, '❌ Command doesn\'t exist');
        }
    }

    u.loader.reloadCommands();

    bot.createMessage(msg.channel.id, '✅ Reloaded commands and handlers.');
}