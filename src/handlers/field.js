import HandlerStructure from '../structures/handler';

/**
 * Field handler.
 */
class FieldHandler extends HandlerStructure {
    /**
     * Create field handler.
     *
     * @param {Object} client - DMDb client extends Eris
     * @param {Object} data - Data for use in fields (primarily the TMDb API response)
     */
    constructor(client) {
        super(client, 'fields');

        this.data = {};
        this._fields = {};
    }

    /**
     * Get guild settings from database.
     *
     * @param {Object} ID - Guild ID
     * @returns {Object} - Guild settings
     */
    getGuildSettings(ID) {
        return this.client.repository.getRepository('guilds').getOrUpdate(ID);
    }

    /**
     * Check if field is supported in a given command.
     *
     * @param {string} command - Command name
     * @returns {boolean}
     */
    checkSupport(command){
        // TODO
    }

    /**
     * Runs when handlers have finished loading.
     *
     * @param {Object} events - Events
     * @returns {undefined}
     */
    onLoad(fieldTypes) {
        for (let type in fieldTypes) {
            Object.keys(fieldTypes[type].render).map((f) => this._fields[f] = type);
        }

        // this.client.log.info('found fields', this._fields);
    }

    /**
     * Set data.
     *
     * @param {Object} data - Keyed data for filling field templates
     */
    setData(data) {
        // this.client.log.info('setting data', data);
        this.data = data;
    }

    /**
     * Checks field values and sets them as inline by default.
     *
     * @param {Array} fields - Fields
     * @param {boolean} notInline - Disable default inline?
     * @returns {Array} - Fields
     */
    checkFields(fields, notInline) {
        // TODO: switch commands to using this instead of "fields" in CommandStructure
        return fields.map(field => ({
            name: field.name,
            value: this.check(field.value),
            inline: notInline ? false : typeof field.inline === 'boolean' ? field.inline : true
        }));
    }

    /**
     * Run a field template if it's defined.
     *
     * @param {string} type - Type of template we want
     * @returns {object} - A {fields} field, or empty object
     */
    getTemplate(type) {
        // TODO: don't hard-code this....
        // check for templates saved to the guild settings, fall back to defaults
        // make sure defaults don't change output from what previously existed
        // (including some special "thisOrThat" fields that do their own fallbacks)
        let template = ['runtime', 'status'];

        const fields = [];
        template.forEach(f => fields.push(this.render(f)));

        // Filter out any empty objects render() might have included on errors
        return fields.filter(o => Object.keys(o).length);
    }

    /**
     * Run a field template if it's defined.
     *
     * @param {string} template - Template
     * @returns {object} - A {fields} field, or empty object
     */
    render(field) {
        const type = this._fields[field];
        if (!type) { return {}; }

        const r = this.fields[type].render[field];

        return r ? r() : {};
    }
}

export default FieldHandler;
