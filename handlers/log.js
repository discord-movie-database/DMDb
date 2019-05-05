const chalk = require('chalk');

class LogHandler {
    constructor() {
        this.error = this.error.bind(this);
    }

    _format(message) {
        const date = new Date();
        return `[${date.toISOString()}] ${message}`;
    }

    success(message) {
        console.log(this._format(`${chalk.black.bgGreen(' SUCCESS ')} ` +
            `${message}`));
    }

    info(message) {
        console.log(this._format(`${chalk.black.bgCyan(' INFO ')} ` +
            `${message}`));
    }

    warning(message) {
        console.log(this._format(`${chalk.black.bgYellow(' WARNING ')} ` +
            `${message}`));
    }

    error(err, message) {
        console.log(this._format(`${chalk.black.bgRed(' ERROR ')} ` +
            `${message || ''} ${err}`));
    }
}

module.exports = LogHandler;
