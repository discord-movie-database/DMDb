class EmbedHandler {
    constructor(client) {
        this.client = client;
    }

    _template(embed) {
        return {
            "embed": {
                "title": embed.title || '',
                "description": embed.description || '',
                "fields": embed.fields || [],
                "color": this.client.config.options.bot.embed.color,
                "url": embed.url || '',
                "thumbnail": {
                    "url": embed.thumbnail
                }
            },
            "content": embed.content || ''
        }
    }

    async edit(message, embed) {
        return await message.edit(this._template(embed))
                    .catch(err => this.client.handlers.log.error);
    }

    async create(channelID, embed) {
        return await this.client.createMessage(channelID, this._template(embed))
                    .catch(err => this.client.handlers.log.error);
    }

    async error(channelID, message) {
        return await this.client.createMessage(channelID, this._template({
            title: 'Error',
            description: message
        })).catch(err => this.client.handlers.log.error);
    }
}

module.exports = EmbedHandler;