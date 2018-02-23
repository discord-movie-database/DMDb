const chalk = require('chalk');

const log = module.exports = {};
const line = '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~';

log.command = (msg, cmdName, cmdArgs) => {
    const lineCol = chalk.blue(line);

    let logMsg = lineCol;
    logMsg += `\n${chalk.bold('Command:')} ${cmdName.charAt(0).toUpperCase() + cmdName.slice(1)}`;
    logMsg += `\n${chalk.bold('Username:')} ${msg.author.username} (${chalk.dim(msg.author.id)})`;
    if (msg.channel.guild) {
        logMsg += `\n${chalk.bold('Channel:')} ${msg.channel.name} (${chalk.dim(msg.channel.id)})`;
        logMsg += `\n${chalk.bold('Guild:')} ${msg.channel.guild.name} (${chalk.dim(msg.channel.guild.id)})`;
    } else {
        logMsg += `\n${chalk.bold('Channel:')} Direct Message`;
    }
    if (cmdArgs[0]) logMsg += `\n${chalk.bold('Arguments:')} ${cmdArgs.join(' ')}`;
    logMsg += `\n${lineCol}`;

    console.log(logMsg);
}

log.error = (err, msg) => {
    const lineCol = chalk.red.bold(line);

    console.log(`${lineCol}\n${chalk.bold(msg || 'No custom error message.')}\n\n${err}\n${lineCol}`);
}