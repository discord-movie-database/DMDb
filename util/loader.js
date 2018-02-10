const fs = require('fs');

const l = module.exports = {};

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
        let cmdName = cmdsDir[i].substring(0, cmdsDir[i].length - 3);
        main.commands[cmdName] = require(`../cmds/${cmdName}`);
    }
}

l.unloadCommands = () => {
    for (i in main.commands) l.deleteCache(i, true);
}

l.reloadUtil = () => {
    let utilDir = fs.readdirSync('./util/');

    for (let i = 0; i < utilDir.length; i++) l.deleteCache(`./${utilDir[i]}`, false);
}

l.reloadCommands = () => {
    l.unloadCommands();
    l.loadCommands();
    l.reloadUtil();
}