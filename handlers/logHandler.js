const chalk = require('chalk');

class LogHandler {
    constructor(client) {
        this.client = client;
    }

    _format(message) {
        const date = new Date();

        return `[${date.toISOString()}] ${message}`;
    }

    success(message) {
        console.log(this._format(`${chalk.black.bgGreen(' SUCCESS ')} ${chalk.bold(message)}`));
    }

    info(message) {
        console.log(this._format(`${chalk.black.bgCyan(' INFO ')} ${message}`));
    }

    warning(message) {
        console.log(this._format(`${chalk.black.bgYellow(' WARNING ')} ${message}`));
    }

    error(err, message) {
        console.log(this._format(`${chalk.black.bgRed(' ERROR ')} ${message || ''}\n${err}\n`));
    }
}

module.exports = LogHandler;