import _config from '../config';

import Eris from 'eris';

import consola from 'consola';
import axios from 'axios';

import RepositoryHandler from './handlers/repository';
import UtilHandler from './handlers/util';
import EventHandler from './handlers/event';
import CommandHandler from './handlers/command';
import RoutineHandler from './handlers/routine';

/**
 * DMDb Discord bot.
 * 
 * @prop {boolean} loaded - Status
 * @prop {Object} config - Bot settings
 * @prop {*} log - Consola
 * @prop {*} axios - Axios
 * @prop {*} db - Mongoose
 * @prop {*} repository - Repository handler
 * @prop {*} util - Util handler
 * @prop {*} event - Event handler
 * @prop {*} command - Command handler
 * @prop {*} routine - Routine handler
 */
class Client extends Eris {
    /**
     * Create client.
     * 
     * @param {Object} config - Bot settings
     */
    constructor(config) {
        super(config.tokens.discord, config.client);

        this.log = consola;
        this.axios = axios;

        this.config = config;

        this.loaded = false;
        this.start = new Date();

        this.repository = new RepositoryHandler(this);
        this.util = new UtilHandler(this);
        this.event = new EventHandler(this);
        this.command = new CommandHandler(this);
        this.routine = new RoutineHandler(this);

        this.load = async () => {
            await this.util.loadFiles();
            await this.repository.loadFiles();
    
            this.repository.connect();
        }

        this.on('db', async () => {
            await this.event.loadFiles();
            await this.command.loadFiles();
            await this.routine.loadFiles();

            const time = new Date(new Date() - this.start).getTime() / 1000;

            this.log.success(`Finished loading. Took ${time}s.`);

            this.connect();
        });

        this.load();
    }
}

new Client(_config);
