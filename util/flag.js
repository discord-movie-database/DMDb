const config = require('../config.json');
const f = module.exports = {};

f.main = (args, flags) => {
    let result = {};
    for (let i = 0; i < args.length; i++) {
        let arg = args[i].toLowerCase();
        let nextArg = args[i + 1];
        for (let o = 0; o < flags.length; o++) {
            let flag = flags[o];
            let shortFlag = flags[o][0];
            if (arg === `-${shortFlag}` || arg === `--${flag}` && nextArg) {
                result[flag] = nextArg;
                args.splice(i, 2);
                i--;
            }
        }
    }
    result.args = args;
    return result;
}