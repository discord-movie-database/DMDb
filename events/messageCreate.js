const chalk = require('chalk');

class MsgEvent {
    constructor(client) {
        this.client = client;

        this.dbHandler = this.client.handlers.db;

        this.process = this.process.bind(this);
    }

    _checkPermission(command, message) {
        return command.info.restricted
            && !this.client.config.options.bot.developers.includes(parseInt(message.author.id));
    }

    async process(message) {
        if (message.bot) return;

        let guildDB;
        if (message.channel.guild) guildDB = await this.dbHandler.getGuild(message.channel.guild.id);

        message.prefix = guildDB.prefix || this.client.prefix;
        if (!message.content.startsWith(message.prefix)) return;

        const messageSplit = message.content.split(' ');
        const commandName = messageSplit[0].toLowerCase().slice(message.prefix.length);
        message.arguments = messageSplit.slice(1);

        if (!this.client.commands[commandName]) return;
        const command = this.client.commands[commandName];

        if (guildDB.disabledCommands
            && guildDB.disabledCommands.indexOf(commandName) > -1) return;

        if (this._checkPermission(command, message))
            return this.client.handlers.embed.error(message.channel.id, 'No Permission.');

        try {
            command.process(message);
        } catch (err) {
            this.client.handlers.log.error(err);

            return this.client.handlers.embed.error(message.channel.id, `Error executing command: ${commandName}`);
        }

        this.client.handlers.log.info(`Command: ${commandName} | User: ${message.author.id} | \
Guild: ${message.channel.guild ? message.channel.guild.id : 'DM'}${message.arguments[0] ? ` | \
Args: ${message.arguments.join(' ')}` : ''}`);
    }
}

module.exports = MsgEvent;