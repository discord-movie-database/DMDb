class EmbedHandler {
    constructor(client) {
        this.client = client;
    }

    _template(embed) {
        if (typeof embed === 'string') return embed;

        return {
            'embed': {
                'title': embed.title || '',
                'description': embed.description || '',
                'fields': embed.fields || [],
                'color': parseInt(this.client.config.options.bot.embed.color),
                'url': embed.url || '',
                'thumbnail': {
                    'url': embed.thumbnail
                }
            },
            'content': embed.content || ''
        }
    }

    edit(message, embed) {
        return message.edit(this._template(embed))
                    .catch(this.client.handlers.log.error);
    }

    create(channelID, embed) {
        return this.client.createMessage(channelID, this._template(embed))
                    .catch(this.client.handlers.log.error);
    }

    error(channelID, message) {
        return this.client.createMessage(channelID, this._template({
            title: 'Error',
            description: message
        })).catch(this.client.handlers.log.error);
    }
}

module.exports = EmbedHandler;