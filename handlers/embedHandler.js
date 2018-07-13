class EmbedHandler {
    constructor(client) {
        this.client = client;

        this.colors = {};
        this.colors.red = 0xFF3232;
        this.colors.green = 0x329932;
    }

    _template(embed) {
        if (typeof embed === 'string') return embed;

        return {
            'embed': {
                'title': embed.title || '',
                'description': embed.description || '',
                'fields': embed.fields || [],
                'color': embed.color
                    || parseInt(this.client.config.options.bot.embed.color),
                'url': embed.url || '',
                'thumbnail': {
                    'url': embed.thumbnail || ''
                },
                'footer': {
                    'text': embed.footer || ''
                }
            },
            'content': embed.content || ''
        }
    }

    _type(message, embed) {
        if (['string', 'number'].indexOf(typeof message) > -1)
            return this.create(message, embed);
        return this.edit(message, embed);
    }

    create(channelID, embed) {
        return this.client.createMessage(channelID, this._template(embed))
                          .catch(this.client.handlers.log.error);
    }

    edit(message, embed) {
        return message.edit(this._template(embed))
                      .catch(this.client.handlers.log.error);
    }

    error(message, content) {
        const embed = {
            'title': 'Error',
            'description': content,
            'color': this.colors.red
        };

        return this._type(message, embed);
    }

    success(message, content) {
        const embed = {
            'title': 'Success',
            'description': content,
            'color': this.colors.green
        };

        return this._type(message, embed);
    }
}

module.exports = EmbedHandler;