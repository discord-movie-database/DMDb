import UtilStructure from '../structures/util';

/**
 * Embed util.
 */
class EmbedUtil extends UtilStructure {
    /**
     * Create embed util structure.
     * 
     * @param {Object} client DMDb client extends Eris
     */
    constructor(client) {
        super(client);
    }

    /**
     * Create a Message Object.
     * 
     * @param {Object} embed Embed data
     * @returns {Object} Message Object
     */
    template(embed) {
        if (typeof embed === 'string') return { content: embed, embed: {} };

        return {
            embed: {
                title: embed.title || '',
                description: embed.description || '',
                fields: embed.fields || [],
                color: embed.color || 0xE6B91E,
                url: embed.url || '',
                thumbnail: { url: embed.thumbnail || '' },
                image: { url: embed.image || '' },
                footer: { text: embed.footer || '' },
                video: { url: embed.video || '' },
                timestamp: embed.timestamp || '',
            },

            content: embed.content || '',
        };
    }

    /**
     * Create or edit a message.
     * 
     * @param {(String | Object)} message Channel ID or Message Promise
     * @param {Object} embed Embed data
     * @returns {Promise} Message Promise
     */
    handle(message, embed) {
        if (typeof message === 'string') {
            return this.create(message, embed);
        } else {
            return this.edit(message, embed);
        }
    }

    /**
     * Create a message.
     * 
     * @param {String} channelID Channel ID
     * @param {Object} embed Embed Data
     * @returns {Promise} Message Promise
     */
    create(channelID, embed) {
        try {
            return this.client.createMessage(channelID, this.template(embed));
        } catch (error) {
            consola.error(error);
        }
    }

    /**
     * Edit a message.
     * 
     * @param {Promise} message Message to edit
     * @param {Object} embed Embed Data
     * @returns {Promise} Message Promise
     */
    edit(message, embed) {
        try {
            if (message.timeout) clearTimeout(message.timeout);

            return message.edit(this.template(embed));
        } catch (error) {
            consola.error(error);
        }
    }

    /**
     * Create or edit a successa message.
     * 
     * @param {(Object | string)} message Channel ID or Message Promise
     * @param {String} content Success message
     * @returns {Promise} Message Promise
     */
    success(message, content) {
        return this.handle(message, {
            color: 0x329932,
            title: 'Success',
            description: content || 'No success message.',
        });
    }

    /**
     * Create or edit an error message.
     * 
     * @param {(Object | string)} message Channel ID or Message Promise
     * @param {String} content Error message
     * @returns {Promise} Message Promise
     */
    error(message, content) {
        return this.handle(message, {
            color: 0xFF3232,
            title: 'Error',
            description: content || 'No error message.',
        });
    }
}

export default EmbedUtil;
