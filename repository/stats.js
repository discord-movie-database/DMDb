import RepositoryStructure from '../structures/repository';

class StatsRepository extends RepositoryStructure {
    constructor(client) {
        super(client);

        this.model = this.db.model('stats', new this.db.Schema({
            time: { type: Date, default: new Date() },
            guilds: { type: Number, required: true },
            channels: { type: Number, required: true },
            users: { type: Number, required: true },
        }));
    }

    insert(data) {
        return this.model.create({ ...data });
    }
}

export default StatsRepository;
