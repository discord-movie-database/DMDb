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
        // Check if not a bot
        if (message.bot) return;

        // Get guild information from database
        let guildDB = {};
        if (message.channel.guild)
            guildDB = await this.dbHandler.getOrUpdateGuild(message.channel.guild.id);
        message.db = guildDB;

        // Get guild prefix
        message.prefix = message.db.prefix || this.client.prefix;
        if (!message.content.startsWith(message.prefix)) return;

        // Command information
        const messageSplit = message.content.split(' ');
        const commandName = messageSplit[0].toLowerCase().slice(message.prefix.length);
        message.arguments = messageSplit.slice(1);

        // Check if command exists
        if (!this.client.commands[commandName]) return;
        const command = this.client.commands[commandName];

        // Check if command is disabled in guild
        if (guildDB.disabledCommands && guildDB.disabledCommands.indexOf(commandName) > -1)
            return guildDB.messages && guildDB.messages.commanddisabled ?
                this.client.handlers.embed.error(message.channel.id, 
                    'This command is disabled.') : null;

        // Check if user has developer permission
        if (this._checkPermission(command, message))
            return this.client.handlers.embed.error(message.channel.id, 'No Permission.');

        // Execute command
        try {
            command.process(message);
        } catch (err) {
            this.client.handlers.log.error(err);

            return this.client.handlers.embed.error(message.channel.id,
                `Error executing command: ${commandName}`);
        }

        // Memory stats
        this.client.commands[commandName].info.usageCount++;
        this.client.stats.totalUsageCount++;
        
        // Database stats
        if (guildDB) await this.dbHandler.getOrUpdateGuild(message.channel.guild.id, {
            'usageCount': guildDB.usageCount + 1 });

        // Success log
        this.client.handlers.log.info(`Command: ${commandName} | User: ${message.author.id} | \
Guild: ${message.channel.guild ? message.channel.guild.id : 'DM'}${message.arguments[0] ? ` | \
Args: ${message.arguments.join(' ')}` : ''}`);
    }
}

module.exports = MsgEvent;