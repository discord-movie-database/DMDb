const template = require('./template.js');

class optionToggleMessage extends template {
    constructor(client) {
        super(client, {
            'name': 'togglemessage',
            'description': 'Enable or disable config related error and success messages.',
            'usage': '[message name]'
        });

        this.info.messages = {};
        this.info.messages.commanddisabled = 'Error message if trying to execute disabled command.';

        this.messageKeys = Object.keys(this.info.messages);
    }
    
    messageList(message) {
        return this.embed.create(message.channel.id, {
            'title': 'Guild Configuration',
            'description': 'Toggle configuration related messages.',

            'fields': this.messageKeys.map(key => ({
                'name': key,
                'value': this.info.messages[key],
                'inline': true }))
        });
    }

    async process(message) {
        const argument = message.arguments[0];
        if (!argument) return this.messageList(message);
        if (this.messageKeys.indexOf(argument) < 0) 
            return this.embed.error(message.channel.id, 'Message name not found.');

        const guild = await this.dbHandler.getOrUpdateGuild(message.channel.guild.id);

        const toggle = guild.messages && guild.messages[argument] ? false : true;

        const updatedGuild = await this.dbHandler.getOrUpdateGuild(message.channel.guild.id, {
            'messages': { [argument]: toggle } });
        if (updatedGuild) return this.embed.success(message.channel.id,
            `**${toggle ? 'Enabled' : 'Disabled'}** the \`${this.capitaliseStart(argument)}\` message.`);

        return this.embed.error(message.channel.id, 'Unable to toggle message.');
    }
}

module.exports = optionToggleMessage;