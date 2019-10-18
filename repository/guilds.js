import RepositoryStructure from '../structures/repository';

class GuildsRepository extends RepositoryStructure {
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

    get(id) {
        return this.model.findOne({ id });
    }

    insert(id, data) {
        return this.model.create({ id, ...data });
    }

    update(id, data) {
        return this.model.findOneAndUpdate({ id }, { ...data });
    }

    delete(id) {
        return this.model.deleteOne({ id });
    }
}

export default GuildsRepository;
