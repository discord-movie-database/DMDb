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
        return {
            embed: {
                title: embed.title || '',
                description: embed.description || '',
                fields: embed.fields || [],
                color: embed.color || 0xE6B91E,
                url: embed.url || '',
                thumbnail: { url: embed.thumbnail || '' },
                footer: { text: embed.footer || '' },
            },

            content: embed.content || ''
        }
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
     * @param {Promise} messagePromise Message Promise
     * @param {Object} embed Embed Data
     * @returns {Promise} Message Promise
     */
    edit(messagePromise, embed) {
        try {
            return messagePromise.edit(this.template(embed));
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
            color: 0xFF3232,
            title: 'Success',
            description: content,
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
            color: 0x329932,
            title: 'Error',
            description: content,
        });
    }
}

export default EmbedUtil;
