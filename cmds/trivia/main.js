const fs = require('fs');
const u = require('../../util/main.js');
const config = require('../../config.json');

const triviaSettings = (type, update) => {
    type = type.toLowerCase();
    if (type === 'get') return JSON.parse(fs.readFileSync('./cmds/trivia/trivia.json'));
    if (type === 'update') return fs.writeFileSync('./cmds/trivia/trivia.json', JSON.stringify(update, null, 2));
    return false;
}

const args = {
    "start": {
        "process": (bot, msg) => {
            let aTrivSet = triviaSettings('get');
            if (aTrivSet.started) return bot.createMessage(msg.channel.id, 'A game of trivia has already been started.');
            aTrivSet.started = true;
            let updTrivSet = triviaSettings('update', aTrivSet);
        },
        "restricted": true,
        "description": "Start a game.",
        "usage": ""
    },
    "end": {
        "process": () => {
            let aTrivSet = triviaSettings('get');
            if (!aTrivSet.started) return bot.createMessage(msg.channel.id, 'There are no games of trivia running.');
            aTrivSet.started = false;
            let updTrivSet = triviaSettings('update', aTrivSet);
        },
        "restricted": true,
        "description": "Force end the current game.",
        "usage": ""
    },
    "status": {
        "process": () => {
            
        },
        "restricted": false,
        "description": "Current game information.",
        "usage": ""
    },
    "vote": {
        "process": () => {
            
        },
        "restricted": false,
        "description": "Vote on a option.",
        "usage": "Option Num"
    },
    "last": {
        "process": () => {
            
        },
        "restricted": false,
        "description": "Last game information.",
        "usage": ""
    }
}

const c = module.exports = {};
c.settings = require('./settings.json');
c.process = async (bot, msg, cmdArgs, guild, user) => {
    if (msg.channel.guild && msg.channel.guild.id !== "223563882642407426") return;
    cmdArgs = cmdArgs.join('').toLowerCase().split(' ');
    if (cmdArgs[0] && args[cmdArgs[0]]) {
        if (args[cmdArgs[0]].restricted && msg.author.id !== msg.channel.guild.ownerID) return;
        args[cmdArgs[0]].process(bot, msg);
        return;
    }
    let noArgs = '__**Trivia Arguments**__\n';
    for (i in args) {
        noArgs += `\n**${i.charAt(0).toUpperCase() + i.slice(1)}** `;
        if (args[i].usage) noArgs += `\`${args[i].usage}\` `;
        if (args[i].description) noArgs += args[i].description;
    }
    bot.createMessage(msg.channel.id, noArgs);
}
