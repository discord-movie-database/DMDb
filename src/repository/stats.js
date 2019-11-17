import RepositoryStructure from '../structures/repository';

/**
 * Stats repository.
 * 
 * @prop {Object} model - Stats model
 */
class StatsRepository extends RepositoryStructure {
    /**
     * Create stats repository.
     * 
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client);

        this.model = this.db.model('stats', new this.db.Schema({
            time: { type: Date, default: new Date() },
            guilds: { type: Number, required: true },
            channels: { type: Number, required: true },
            users: { type: Number, required: true },
        }));
    }

    /**
     * Insert stats into database.
     * 
     * @param {Object} data - Stat data
     * @returns {Promise} - Stats
     */
    insert(data) {
        return this.model.create({ ...data });
    }
}

export default StatsRepository;
