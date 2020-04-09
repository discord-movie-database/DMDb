import HandlerStructure from '../structures/handler';

/**
 * Command handler.
 * 
 * @prop {number} commandsExecuted - Amount of commands executed since last restart
 */
class CommandHandler extends HandlerStructure {
    /**
     * Create command handler.
     * 
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client, 'commands');

        this.commandsExecuted = 0;
    }

    /**
     * Get command.
     * 
     * @param {string} commandName - Command name
     * @returns {Object} - Command Object
     */
    getCommand(commandName) {
        return this.commands[commandName];
    }

    /**
     * Get guild settings from database.
     * 
     * @param {Object} ID - Guild ID
     * @returns {Object} - Guild settings 
     */
    getGuildSettings(ID) {
        return this.client.repository.getRepository('guilds').getOrUpdate(ID);
    }

    /**
     * Check if user is a developer.
     * 
     * @param {Object} user - User Object
     * @returns {boolean} - Is developer?
     */
    isDeveloper(user) {
        return this.client.config.developers.indexOf(user.id) > -1;
    }

    /**
     * Check if command name is an alias.
     * 
     * @param {string} commandName - Command name
     * @returns {Object} Command
     */
    checkAlias(commandName){
        for (const command in this.commands) {
            const aliases = this.commands[command].meta.aliases;

            for (let i = 0; i < aliases.length; i++) {
                if (aliases[i] === commandName) return this.commands[command];
            }
        }
    }

    /**
     * Checks if user has permission to run a command.
     * 
     * @param {Object} command - Command Object 
     * @param {Object} user - User Object
     * @returns {boolean} - Has permission?
     */
    hasPermission(command, user) {
        return command.meta.developerOnly ? this.isDeveloper(user) : true;
    }

    /**
     * Handles message event and checks for command.
     * 
     * @param {Object} message - Message Object
     * @returns {undefined}
     */
    async onMessageEvent(message) {
        const user = message.author;

        if (!message.channel.guild) return;
        if (user.bot) return;

        const guildSettings = await this.getGuildSettings(message.channel.guild.id);
        let prefix = guildSettings.prefix || this.client.config.prefix;

        if (!message.content.startsWith(prefix)) {
            const mention = `<@${this.client.user.id}> `;

            if (!message.content.startsWith(mention)) return;
            prefix = mention;
        }

        const messageContent = message.content.slice(prefix.length);
        const messageArguments = messageContent.split(' ');

        const commandName = messageArguments[0].toLowerCase();
        const commandArguments = messageArguments.slice(1);

        message.raw = message.content;
        message.content = commandArguments.join(' ');
        message.command = commandName;

        const command = this.commands[commandName] || this.checkAlias(commandName);
        if (!command) return;

        if (guildSettings.disabledCommands.indexOf(commandName) > -1) {
            return guildSettings.commandDisabledMessage
                ? this.client.util.getUtil('embed').error(message.channel.id, 'Command disabled.')
                : null;
        }

        if (!this.hasPermission(command, user)) return;

        try {
            command.executeCommand(message, commandArguments, guildSettings);

            this.commandsExecuted++;

            this.client.log.info(`u${user.id} executed ${commandName} in ` +
                `c${message.channel.id}/g${message.channel.guild.id}` +
                `${message.content ? ` with args ${message.content}` : ''}`);
        } catch (error) {
            this.client.log.error(error);

            this.client.util.getUtil('embed').error('Error executing command. Try again later.');
        }
    }
}

export default CommandHandler;
