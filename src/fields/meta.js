import FieldStructure from '../structures/field';

/**
 * Ready event.
 */
class MetaFields extends FieldStructure {
    /**
     * Create meta field.
     *
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client);

        this.render = {
            status: () => {
                return {
                    name: '🗞️ — Status',
                    value: this.check(this.data('status')),
                    supports: ['movie', 'show'],
                };
            },

            releaseDate: () => {
                return {
                    name: '📆 — Release Date',
                    value: this.date(this.data('release_date')),
                    supports: ['movie', 'show'],
                };
            },

            runtime: () => {
                return {
                    name: '🎞️ — Runtime',
                    value: this.runtime(this.data('runtime')),
                    supports: ['movie', 'show'],
                };
            }
        };
    }
}

export default MetaFields;
