import UtilStructure from '../structures/util';

/**
 * Embed util.
 */
class EmbedUtil extends UtilStructure {
    /**
     * Create embed util structure.
     * 
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client);
    }

    /**
     * Create a Message Object.
     * 
     * @param {Object} embed - Embed data
     * @returns {Object} - Message Object
     */
    template(embed) {
        if (typeof embed === 'string') return { content: embed, embed: {} };

        const structure = {
            title: '',
            description: '',
            url: '',
            timestamp: '',
            color: 0xE6B91E,
            footer: { text: '', icon_url: '' },
            image: { url: '' },
            thumbnail: { url: '' },
            video: { url: '' },
            author: { name: '', url: '' },
            fields: []
        };

        return { content: embed.content || '', embed: Object.assign(structure, embed) };
    }

    /**
     * Create or edit a message.
     * 
     * @param {(string | Object)} message - Channel ID or Message Promise
     * @param {Object} embed - Embed data
     * @returns {Promise} - Message Promise
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
     * @param {string} channelID - Channel ID
     * @param {Object} embed - Embed data
     * @returns {Promise} - Message Promise
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
     * @param {Promise} message - Message to edit
     * @param {Object} embed - Embed data
     * @returns {Promise} - Message Promise
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
     * @param {(Object | string)} message - Channel ID or Message Promise
     * @param {string} content - Success message
     * @param {boolean} [title] - Embed title
     * @returns {Promise} - Message Promise
     */
    success(message, content, title) {
        return this.handle(message, {
            color: 0x329932,
            title: title || 'Success',
            description: content || 'No success message.',
        });
    }

    /**
     * Create or edit an error message.
     * 
     * @param {(Object | string)} message - Channel ID or Message Promise
     * @param {string} content - Error message
     * @param {boolean} [title] - Embed title
     * @returns {Promise} - Message Promise
     */
    error(message, content, title) {
        return this.handle(message, {
            color: 0xFF3232,
            title: title || 'Error',
            description: content || 'No error message.',
        });
    }
}

export default EmbedUtil;
