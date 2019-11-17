import HandlerStructure from '../structures/handler';

/**
 * Command handler.
 * 
 * @prop {number} commandsExecuted - Amount of commands executed since last restart.
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
     * @param {Object} guild - Guild Object
     * @returns {Object} - Guild settings 
     */
    getGuildSettings(guild) {
        return this.client.repository.getRepository('guilds').getOrUpdate(guild.id, true);
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
        const guild = message.channel.guild;

        if (!guild) return;
        if (user.bot) return;

        const guildSettings = await this.getGuildSettings(guild);
        const prefix = guildSettings.prefix || this.client.config.prefix;

        if (!message.content.startsWith(prefix)) return;

        const messageArguments = message.content.split(' ');
        const commandName = messageArguments[0].slice(prefix.length).toLowerCase();
        const commandArguments = messageArguments.slice(1);

        message.raw = message.content;
        message.content = commandArguments.join(' ');
        message.command = commandName;

        const command = this.commands[commandName];
        if (!command) return;

        if (!this.hasPermission(command, user)) return;

        try {
            command.executeCommand(message, commandArguments, guildSettings);

            this.commandsExecuted++;
            this.client.log.info(`${user.id} executed ${commandName} in ${guild.id}`);
        } catch (error) {
            this.client.log.error(error);

            this.client.util.getUtil('embed').error('Error executing command. Try again later.');
        }
    }
}

export default CommandHandler;
