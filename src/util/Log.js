/* eslint-disable no-console */

import chalk from 'chalk';

import Util from '../structures/Util';

/**
 * Log utility.
 */
export default class Log extends Util {
    /**
     * Creates an instance of Log.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client);
    }

    /**
     * Adds ISO string timestamp before message.
     *
     * @prop {string} message Message
     * @returns {string}
     */
    timestamp(message) {
        return `${new Date().toISOString()} ${message}`;
    }

    /**
     * Logs an info message to console.
     *
     * @param {string} message Message
     * @returns {undefined}
     */
    info(message) {
        console.log(this.timestamp(`${chalk.black.bgCyan(' INFO ')} ${message}`));
    }

    /**
     * Logs a success message to console.
     *
     * @param {string} message Message
     * @returns {undefined}
     */
    success(message) {
        console.log(this.timestamp(`${chalk.black.bgGreen(' SUCC ')} ${message}`));
    }

    /**
     * Logs a warning message to console.
     *
     * @param {string} message Message
     * @returns {undefined}
     */
    warn(message) {
        console.log(this.timestamp(`${chalk.black.bgYellow(' WARN ')} ${message}`));
    }

    /**
     * Logs a error message to console.
     *
     * @param {string} message Message
     * @returns {undefined}
     */
    error(message) {
        console.log(this.timestamp(`${chalk.black.bgRed(' ERRO ')} ${message}`));
    }

    /**
     * Logs a debug message to console.
     *
     * @param {string} message Message
     * @returns {undefined}
     */
    debug(message) {
        console.log(this.timestamp(`${chalk.black.bgCyan(' DBUG ')} ${message}`));
    }
}
