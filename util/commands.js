const fs = require('fs');
const path = require('path');
const u = module.exports = {};

u.loadCommands = async () => {
    console.log('Loading commands...');
    main.commands = {};
    let cmdsDir = fs.readdirSync('./cmds/').reverse();
    for (let i = 0; i < cmdsDir.length; i++) {
        let cmdName = cmdsDir[i];
        main.commands[cmdName] = require(`../cmds/${cmdName}/main.js`);
        console.log(`Loaded command ${cmdName}..`);
    }
    console.log('Finished loading commands.');
}

u.unloadCommands = async () => {
    console.log('Unloading commands...');
    for (i in main.commands) {
        delete require.cache[require.resolve(`../cmds/${i}/main.js`)];
        delete require.cache[require.resolve(`../cmds/${i}/settings.json`)];
        console.log(`Unloaded command ${i}..`);
    }
    console.log('Finished unloading commands.');
}

u.reloadUtil = async () => {
    console.log('Reloading assets...');
    let utilDir = fs.readdirSync('./util/');
    for (let i = 0; i < utilDir.length; i++) {
        delete require.cache[require.resolve(`./${utilDir[i]}`)];
        console.log(`Reloaded util ${utilDir[i].replace('.js', '')}..`);
    }
    console.log('Finished reloading assets.');
}

u.reloadCommands = async () => {
    console.log('Reloading commands...');
    u.unloadCommands();
    u.loadCommands();
    u.reloadUtil();
    console.log('Finished reloading commands.');
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
