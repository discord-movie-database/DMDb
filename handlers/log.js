const chalk = require('chalk');

const log = module.exports = {};

log.command = (msg, cmdName, cmdArgs) => {
    let logMsg = chalk.blue('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    logMsg += `\n${chalk.bold('Command:')} ${cmdName.charAt(0).toUpperCase() + cmdName.slice(1)}`;
    logMsg += `\n${chalk.bold('Username:')} ${msg.author.username} (${chalk.italic.dim(msg.author.id)})`;
    if (msg.channel.guild) {
        logMsg += `\n${chalk.bold('Channel:')} ${msg.channel.name} (${chalk.italic.dim(msg.channel.id)})`;
        logMsg += `\n${chalk.bold('Guild:')} ${msg.channel.guild.name} (${chalk.italic.dim(msg.channel.guild.id)})`;
    } else {
        logMsg += `\n${chalk.bold('Channel:')} Direct Message`;
    }
    if (cmdArgs[0]) logMsg += `\n${chalk.bold('Arguments:')} ${cmdArgs.join(' ')}`;
    logMsg += chalk.blue('\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');

    console.log(logMsg);
}

log.error = () => {
    // TODO
}