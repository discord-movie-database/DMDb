const fs = require('fs');

const l = module.exports = {};

l.loadCommand = (cmd) => {
    main.commands[cmd] = require(`../cmds/${cmd}`);
}

l.reloadCommand = (cmd) => {
    if (main.commands[cmd]) {
        l.deleteCache(cmd, true);
        l.loadCommand(cmd);
    }
}

l.deleteCache = (name, cmd) => {
    if (cmd) {
        delete require.cache[require.resolve(`../cmds/${name}.js`)];

        return;
    }

    delete require.cache[require.resolve(name)];
}

l.loadCommands = () => {
    main.commands = {};

    let cmdsDir = fs.readdirSync('./cmds/').reverse();

    for (let i = 0; i < cmdsDir.length; i++) {
        let cmdName = cmdsDir[i].match(/([a-z]+)\.js/)[1];
        l.loadCommand(cmdName);
    }
}

l.unloadCommands = () => {
    for (i in main.commands) {
        if (main.commands[i].reload) main.commands[i].reload();
        l.deleteCache(i, true);
    }
}

l.reloadUtil = () => {
    let utilDir = fs.readdirSync('./handlers/');

    for (let i = 0; i < utilDir.length; i++) l.deleteCache(`./${utilDir[i]}`, false);
}

l.reloadCommands = () => {
    l.unloadCommands();
    l.loadCommands();
    l.reloadUtil();
}