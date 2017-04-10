const fs = require('fs');
const l = module.exports = {};

l.deleteCache = (name, cmd) => {
    if (cmd) {
        delete require.cache[require.resolve(`../cmds/${name}/main.js`)];
        delete require.cache[require.resolve(`../cmds/${name}/settings.json`)];
        return;
    }
    delete require.cache[require.resolve(name)];
}

l.loadCommands = () => {
    main.commands = {};
    let cmdsDir = fs.readdirSync('./cmds/').reverse();
    for (let i = 0; i < cmdsDir.length; i++) {
        let cmdName = cmdsDir[i];
        main.commands[cmdName] = require(`../cmds/${cmdName}/main.js`);
    }
}

l.unloadCommands = () => {
    for (i in main.commands) l.deleteCache(i, true);
}

l.reloadUtil = () => {
    let utilDir = fs.readdirSync('./util/');
    for (let i = 0; i < utilDir.length; i++) {
        l.deleteCache(`./${utilDir[i]}`, false);
    }
}

l.reloadCommands = () => {
    l.unloadCommands();
    l.loadCommands();
    l.reloadUtil();
}

l.reloadCommand = (cmd) => {
    cmd = cmd.toLowerCase();
    if (main.commands[cmd]) {
        l.deleteCache(cmd, true);
        return {"err": false, "msg": `Reloaded command ${cmd}.`};
    }
    return {"err": true, "msg": "Command not found."};
}
