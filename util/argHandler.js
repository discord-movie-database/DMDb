const config = require('../config.json');
const ah = module.exports = {};

ah.main = (args, cmds) => {
    let result = {};
    for (let i = 0; i < args.length; i++) {
        let arg = args[i].toLowerCase();
        let nextArg = args[i + 1];
        for (let o = 0; o < cmds.length; i++) {
            let cmd = cmds[o];
            let shortCmd = cmds[o][0];
            if (arg === `-${shortCmd}` || arg === `--${cmd}` && nextArg) {
                result[cmd] = nextArg;
            }
        }
    }
    result.args = args;
    return result;
}