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
        console.log(`Unloaded command ${i}..`);
    }
    console.log('Finished unloading commands.');
}

u.reloadCommands = async () => {
    console.log('Reloading commands...');
    u.unloadCommands();
    u.loadCommands();
    console.log('Finished reloading commands.');
}
