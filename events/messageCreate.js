const chalk = require('chalk');

class MsgEvent {
    constructor(client) {
        this.client = client;

        this.process = this.process.bind(this);
    }

    _checkPermission(command, message) {
        return command.info.restricted
        && !this.client.config.options.bot.developers.includes(parseInt(message.author.id));
    }

    process(message) {
        if (message.bot) return;
        if (!message.content.startsWith(this.client.prefix)) return;

        const messageSplit = message.content.split(' ');
        const commandName = messageSplit[0].toLowerCase().slice(this.client.prefix.length);
        message.arguments = messageSplit.slice(1);

        if (!this.client.commands[commandName]) return;
        const command = this.client.commands[commandName];

        if (this._checkPermission(command, message))
            return this.client.handlers.embed.error(message.channel.id, 'No Permission.');

        try {
            command.process(message);
        } catch (err) {
            this.client.handlers.log.error(err);

            return this.client.handlers.embed.error(message.channel.id, `Error executing command: ${commandName}`);
        }

        this.client.handlers.log.info(`${message.author.id} executed command ${chalk.bold(commandName)} in ${message.channel.guild ? message.channel.guild.id : 'direct message'}.`);
    }
}

module.exports = MsgEvent;