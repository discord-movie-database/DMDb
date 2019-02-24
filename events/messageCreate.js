const chalk = require('chalk');

class MsgEvent {
    constructor(client) {
        this.client = client;
        this.process = this.process.bind(this);

        this.db = this.client.handlers.db;
        this.developers = this.client.config.options.bot.developers;
    }

    async process(message) {
        message.db = {
            'guild': {},
            'user': {}
        }; // Database Object

        if (message.bot) return; // Check if not a bot

        if (message.channel.guild) // Get guild information from database
            message.db.guild = await this.db.getOrUpdateGuild(message.channel.guild.id);

        // Get guild prefix
        if (!message.db.guild.prefix) message.db.guild.prefix = this.client.config.options.bot.prefix;
        if (!message.content.startsWith(message.db.guild.prefix)) return; // Check prefix

        // Command name & arguments
        const messageSplit = message.content.split(' ');
        const commandName = messageSplit[0].toLowerCase().slice(message.db.guild.prefix.length);
        message.arguments = messageSplit.slice(1);

        // Check if command exists
        if (!this.client.commands[commandName]) return;
        const command = this.client.commands[commandName];

        // Check if command is disabled in guild
        if (message.db.guild.disabledCommands && message.db.guild.disabledCommands.indexOf(commandName) > -1)
            return message.db.guild.messages && message.db.guild.messages.commanddisabled ?
                this.client.handlers.embed.error(message.channel.id, 'This command is disabled.') : false;

        // Check if user has developer permission
        if (command.info.restricted && !this.developers.includes(message.author.id))
            return this.client.handlers.embed.error(message.channel.id, 'No Permission.');

        // Get user information from database
        message.db.user = await this.db.getOrUpdateUser(message.author.id);

        try { // Execute command
            command.process(message);
        } catch (err) { // Error
            this.client.handlers.log.error(err);
            return this.client.handlers.embed.error(message.channel.id,
                `There was an error executing this command. Try again later.`);
        }

        // Store usage in memory
        this.client.commands[commandName].info.usageCount++;
        this.client.stats.totalUsageCount++;

        // Command execution log
        this.client.handlers.log.info(`${message.db.guild.prefix}${chalk.bold(commandName)} | ` +
            `U${message.author.id} | ` +
            `G${message.channel.guild ? message.channel.guild.id : 'DM'}` +
            `${message.arguments[0] ? ` | Args: ${message.arguments.join(' ')}` : ''}`);
    }
}

module.exports = MsgEvent;