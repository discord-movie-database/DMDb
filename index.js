import Eris from 'eris';
import consola from 'consola';

import _config from './config';

import databaseService from './services/database';

import RepositoryHandler from './handlers/repository';
import UtilHandler from './handlers/util';
import EventHandler from './handlers/event';
import CommandHandler from './handlers/command';
import RoutineHandler from './handlers/routine';

class Client extends Eris {
    constructor(config) {
        super(config.tokens.discord, config.client);

        this.loaded = false;
        this.config = config;

        this.log = consola;

        this.db = databaseService;
        this.db.connection.on('open', () => this.emit('databaseConnect'));

        this.repository = new RepositoryHandler(this);
        this.util = new UtilHandler(this);
        this.event = new EventHandler(this);
        this.command = new CommandHandler(this);
        this.routine = new RoutineHandler(this);
    }
}

new Client(_config);
