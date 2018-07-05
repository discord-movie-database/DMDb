class MsgEvent {
    constructor(client) {
        this.client = client;

        this.process = this.process.bind(this);
    }

    async process(message) {
        if (message.bot) return;
        if (!message.content.startsWith(this.client.prefix)) return;

        const messageSplit = message.content.slice(' ');
        const commandName = messageSplit[0].slice(this.client.prefix.length);
        message.arguments = messageSplit.slice(1);

        if (!commandName && this.client.commands[commandName]) return;

        try {
            await this.client.commands[commandName].process(message);
        } catch (err) {
            this.client.handlers.log.error(err);

            return await this.client.handlers.embed.error(message.channel.id, `Error executing command: ${commandName}`);
        }

        this.client.handlers.log.info(`${message.author.id} executed command ${chalk.bold(commandName)} in ${message.channel.guild ? message.channel.guild.id : 'direct message'}.`);
    }
}

module.exports = MsgEvent;