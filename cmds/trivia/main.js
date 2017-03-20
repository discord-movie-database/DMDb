const fs = require('fs');
const u = require('../../util/main.js');
const config = require('../../config.json');

const triviaSettings = () => {
    return JSON.parse(fs.readFileSync('./cmds/trivia/trivia.json'));
}

const args = {
    "start": {
        "process": () => {
            
        },
        "restricted": true,
        "description": "Start a game.",
        "usage": ""
    },
    "end": {
        "process": () => {
            
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
        if (args[cmdArgs].restricted && msg.author.id !== msg.channel.guild.ownerID) return;
        bot.createMessage(msg.channel.id, "Hello");
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
