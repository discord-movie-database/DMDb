import mongoose from 'mongoose';

import Repository from '../structures/Repository';

/**
 * Guilds repository.
 *
 * @prop {Object} defaults Default values
 * @prop {mongoose.Schema} schema Schema
 * @prop {mongoose.Document} model Model
 */
export default class Guilds extends Repository {
    /**
     * Creates an instance of Guilds.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client);

        this.defaults = {
            prefix: null,
            use_mention_prefix: true,
            disabled_cmds: [],
            cmd_disabled_message: true,
            use_aliases: true,
            templates: [],
            default_template: null,
            api_language: null,
            api_region: null,
        };

        this.schema = new mongoose.Schema({
            id: { type: String, required: true },
            prefix: { type: String, default: this.defaults.prefix },
            use_mention_prefix: { type: Boolean, default: this.defaults.use_mention_prefix },
            disabled_cmds: { type: [String], default: this.defaults.disabled_cmds },
            cmd_disabled_message: { type: Boolean, default: this.defaults.cmd_disabled_message },
            use_aliases: { type: Boolean, default: this.defaults.use_aliases },
            templates: { type: [Object], default: this.defaults.templates },
            default_template: { type: String, default: this.defaults.default_template },
            api_language: { type: String, default: this.defaults.api_language },
            api_region: { type: String, default: this.defaults.api_region },
        });

        this.model = mongoose.model('guilds', this.schema);
    }

    /**
     * Gets a guild, updates or inserts it.
     *
     * @param {(Object|string)} guild Guild ID
     * @param {Object} [data] Updated data
     * @param {Object} [options] Database query options
     * @returns {Promise<Object>}
     */
    getOrUpdateGuild(guild, data = {}, options = {}) {
        options = {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,

            ...options,
        };

        const query = typeof guild === 'object' ? guild : { id: guild };

        return this.model.findOneAndUpdate(query, data, options);
    }
}
