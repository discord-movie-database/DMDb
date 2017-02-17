const u = require('../../util/main.js');
const config = require('../../config.json');
const c = module.exports = {};
c.settings = require('./settings.json');
c.process = async (bot, msg, cmdArgs) => {
    if (cmdArgs[0]) {
        let cmd = cmdArgs[0].toLowerCase();
        if (!main.commands[cmd]) return bot.createMessage(msg.channel.id, '❌ Command not found.');
        let usage = main.commands[cmd].settings.usage || 'N/A';
        let desc = main.commands[cmd].settings.large_description || main.commands[cmd].settings.description || 'N/A';
        let hidden = main.commands[cmd].settings.hidden;
        let verified = main.commands[cmd].settings.verified;
        let restricted = main.commands[cmd].settings.restricted;
        let formatCmd = cmd.charAt(0).toUpperCase() + cmd.slice(1);
        bot.createMessage(msg.channel.id, {embed: {
            author: {
                name: `Command: ${formatCmd}`
            },
            fields: [{
                name: 'Usage',
                value: usage,
                inline: false
            }, {
                name: 'Description',
                value: desc,
                inline: false
            }, {
                name: 'Hidden',
                value: hidden,
                inline: true
            }, {
                name: 'Verified',
                value: verified,
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
    let cmds = [];
    for (i in main.commands) {
        if (main.commands[i].settings.hidden) continue;
        let cmdInfo = '';
        if (main.commands[i].settings.usage) cmdInfo += `*\`${main.commands[i].settings.usage}\`* - `;
        if (main.commands[i].settings.description) cmdInfo += main.commands[i].settings.description;
        cmds.push({
            name: `${config.prefix}${i}`,
            value: cmdInfo,
            inline: false
        });
    }
    bot.createMessage(msg.channel.id, {embed: {
        author: {
            name: "Internet Movie Database"
        },
        description: `Get information on your favourite movies, series and celebrities from IMDb.\nUse ${config.prefix}help [Command Name] to get more information about a command.`,
        fields: cmds,
        color: 0xE6B91E
    }});
}
