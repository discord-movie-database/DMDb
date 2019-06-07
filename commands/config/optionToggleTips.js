const template = require('./template.js');

class optionToggleTips extends template {
    constructor(client) {
        super(client, {
            'name': 'toggletips',
            'description': 'Disable or enable tips.'
        });
    }

    async process(message) {
        const guild = await this.dbHandler.getOrUpdateGuild(message.channel.guild.id);

        const updatedGuild = await this.dbHandler.getOrUpdateGuild(message.channel.guild.id, {
            tips: !guild.tips ? true : false });
        if (updatedGuild) return this.embed.success(message.channel.id,
            `${!guild.tips ? 'Enabled' : 'Disabled'} tips.`);

        this.embed.error(message.channel.id, 'Unable to toggle tips.');
    }
}

module.exports = optionToggleTips; 
