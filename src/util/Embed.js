import Util from '../structures/Util';

/**
 * Embed utility.
 */
export default class Embed extends Util {
    /**
     * Creates an instance of Embed.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client);
    }

    /**
     * Creates an embed message.
     *
     * @param {Object} message Message
     * @param {Object} embed Embed data
     * @returns {Promise<Object>}
     */
    create(message, embed) {
        return embed.content
            ? this.client.createMessage(message.channel.id, { ...embed, embed: embed.embed || {} })
            : this.client.createMessage(message.channel.id, { embed });
    }

    /**
     * Edits an embed message.
     *
     * @param {Object} message Message
     * @param {Object} embed Embed data
     * @returns {Promise<Object>}
     */
    edit(message, embed) {
        if (message.timeout) clearTimeout(message.timeout);

        return embed.content
            ? message.edit({ ...embed, embed: embed.embed || {} })
            : message.edit({ embed });
    }

    /**
     * Is message author the bot used?
     *
     * @param {Object} message Message
     * @returns {boolean}
     */
    isBot(message) {
        return message.author.id === this.client.user.id;
    }

    /**
     * Creates or edits a message with an embed.
     *
     * @param {Object} message Message
     * @param {Object} embed Embed data
     * @returns {Promise<Object>}
     */
    method(message, embed) {
        return this.isBot(message) ? this.edit(message, embed) : this.create(message, embed);
    }

    /**
     * Creates or edits a message with a info embed.
     *
     * @param {Object} message Message
     * @param {(Object|string)} embed Embed data
     * @returns {Promise<Object>}
     */
    info(message, embed) {
        embed = typeof embed === 'string' ? { description: embed } : embed;

        return this.method(message, { title: 'Info', color: 0xe6b91e, ...embed });
    }

    /**
     * Creates or edits a message with a success embed.
     *
     * @param {Object} message Message
     * @param {(Object|string)} embed Embed data
     * @returns {Promise<Object>}
     */
    success(message, embed) {
        embed = typeof embed === 'string' ? { description: embed } : embed;

        return this.method(message, { title: 'Success', color: 0x329932, ...embed });
    }

    /**
     * Creates or edits a message with a error embed.
     *
     * @param {Object} message Message
     * @param {(Object|string)} embed Embed data
     * @returns {Promise<Object>}
     */
    error(message, embed) {
        embed = typeof embed === 'string' ? { description: embed } : embed;

        return this.method(message, { title: 'Error', color: 0xff3232, ...embed });
    }
}
