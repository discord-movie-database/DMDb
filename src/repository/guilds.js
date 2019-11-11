import RepositoryStructure from '../structures/repository';

/**
 * Guilds repository.
 * 
 * @prop {Object} model Guilds model
 */
class GuildsRepository extends RepositoryStructure {
    /**
     * Create guilds repository.
     * 
     * @param {Object} client DMDb client extends Eris
     */
    constructor(client) {
        super(client);

        this.model = this.db.model('guilds', new this.db.Schema({
            id: { type: String, required: true },
            prefix: { type: String, default: '' },
            embedColour: { type: String, default: '' },
            tips: { type: Boolean, default: true },
            commandDisabledMessage: { type: Boolean, default: true },
            disabledCommands: { type: [ String ], default: [] },
            apiLanguage: { type: String, default: 'en' },
            botLanguage: { type: String, default: 'en' },
        }));
    }

    /**
     * Get guild from database.
     * 
     * @param {String} id Guild id
     * @returns {Promise} Guild settings
     */
    get(id) {
        return this.model.findOne({ id });
    }

    /**
     * Insert guild into database.
     * 
     * @param {String} id Guild id
     * @param {Object} data Guild settings
     * @returns {Promise} Guild settings
     */
    insert(id, data) {
        return this.model.create({ id, ...data });
    }

    /**
     * Update guild in database.
     * 
     * @param {String} id Guild id
     * @param {Object} data Guild settings
     * @returns {Promise} Guild settings
     */
    update(id, data) {
        return this.model.findOneAndUpdate({ id }, { ...data });
    }

    /**
     * Delete guild in database.
     * 
     * @param {String} id Guild id
     * @returns {Promise}
     */
    delete(id) {
        return this.model.deleteOne({ id });
    }

    getOrUpdate(id, insert, data) {
        return this.model.findOneAndUpdate({ id }, data || {}, insert ? {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        } : {});
    }
}

export default GuildsRepository;
