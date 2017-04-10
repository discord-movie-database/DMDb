const u = require('../../util/main.js');
const config = require('../../config.json');
const c = module.exports = {};
c.settings = require('./settings.json');
c.process = async (bot, msg, cmdArgs, guild) => {
    if (cmdArgs[0]) {
        let cmd = cmdArgs[0].toLowerCase();
        if (!main.commands[cmd]) return bot.createMessage(msg.channel.id, '❌ Command not found.');
        let usage = main.commands[cmd].settings.usage || 'N/A';
        let desc = main.commands[cmd].settings.large_description || main.commands[cmd].settings.description || 'N/A';
        let hidden = main.commands[cmd].settings.hidden || 'False';
        let restricted = main.commands[cmd].settings.restricted || 'False';
        let formatCmd = cmd.charAt(0).toUpperCase() + cmd.slice(1);
        bot.createMessage(msg.channel.id, {embed: {
            author: {
                name: `Command: ${formatCmd}`
            },
            description: desc,
            fields: [{
                name: 'Usage',
                value: usage,
                inline: false
            }, {
                name: 'Hidden',
                value: hidden,
                inline: true
            }, {
                name: 'Restricted',
                value: restricted,
                inline: true
            }],
            color: 0xE6B91E
        }});
        return;
    }
    let prefix = config.prefix;
    if (guild && guild.prefix) prefix = guild.prefix;
    let description = `__**IMDb Commands**__\n`;
    for (i in main.commands) {
        if (main.commands[i].settings.hidden) continue;
        description += `\n**${prefix}${i}** `
        if (main.commands[i].settings.usage) description += `\`${main.commands[i].settings.usage}\` `;
        if (main.commands[i].settings.description) description += main.commands[i].settings.description;
    }
    description += `\n\n*Use \`${prefix}help [Command Name]\` to get a detailed description for a command.*`;
    bot.createMessage(msg.channel.id, description);
}
