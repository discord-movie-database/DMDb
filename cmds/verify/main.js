const admins = [148899081304014848];
const admin = {
    guild: {
        add: {
            
        },
        remove: {
            
        }
    },
    user: {
        add: {
            
        },
        remove: {
            
        }
    }
};

function check(bot, msg, args, guild) {
    let result = [];
    if (msg.channel.guild)
}

const u = require('../../util/main.js');
const c = module.exports = {};
c.settings = require('./settings.json');
c.process = async (bot, msg, cmdArgs, guild) => {
    let argsJoin = cmdArgs.join(' ');
    if (!msg.channl.guild) return;
    if (cmdArgs[0] === 'admin' && admins.indexOf(msg.author.id) > -1) {
        
    }
}
