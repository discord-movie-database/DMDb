const template = require('./template.js');

class optionPrefix extends template {
    constructor(client) {
        super(client, {
            'name': 'prefix',
            'description': 'Change the prefix to a number, letter or symbol.',
            'usage': '<new prefix>'
        });
    }

    async process(message) {
        const prefix = message.arguments[0];
        if (!prefix) return this.embed.error(message.channel.id, 'New prefix required.');

        const regex = /^[a-z0-9!"£$%^&*()_+=~#~@\';:.,<>?{}`|[\]\/\-]{1,16}$/i;
        if (!regex.test(prefix)) 
            return this.embed.error(message.channel.id, `Invalid prefix. Regex: \`${regex}\``);

        const updatedGuild = await this.dbHandler.getOrUpdateGuild(message.channel.guild.id, {
            'prefix': prefix });

        if (updatedGuild)
            return this.embed.success(message.channel.id, `Updated prefix to \`${prefix}\``);
        this.embed.error(message.channel.id, 'Unable to update prefix.');
    }
}

module.exports = optionPrefix;