const fs = require('fs');
const path = require('path');
const u = module.exports = {};

u.loadCommands = async () => {
    main.commands = {};
    let cmdsDir = fs.readdirSync('./cmds/').reverse();
    for (let i = 0; i < cmdsDir.length; i++) {
        let cmdName = cmdsDir[i];
        main.commands[cmdName] = require(`../cmds/${cmdName}/main.js`);
    }
}

u.unloadCommands = async () => {
    for (i in main.commands) {
        delete require.cache[require.resolve(`../cmds/${i}/main.js`)];
        delete require.cache[require.resolve(`../cmds/${i}/settings.json`)];
    }
}

u.reloadUtil = async () => {
    let utilDir = fs.readdirSync('./util/');
    for (let i = 0; i < utilDir.length; i++) {
        delete require.cache[require.resolve(`./${utilDir[i]}`)];
    }
}

u.reloadCommands = async () => {
    u.unloadCommands();
    u.loadCommands();
    u.reloadUtil();
    console.log('Reloaded commands.');
}

u.reloadCommand = async (cmd, cb) => {
    cmd = cmd.toLowerCase();
    if (main.commands[cmd]) {
        delete require.cache[require.resolve(`../cmds/${cmd}/main.js`)];
        cb({success: `Reloaded command '${cmd}'`});
        return;
    }
    cb({error: "Command doesn't exist."});
}
