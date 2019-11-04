import _config from './config';

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
 * @prop {Boolean} loaded Status
 * @prop {Object} config Bot settings
 * @prop {*} log Consola
 * @prop {*} axios Axios
 * @prop {*} db Mongoose
 * @prop {*} repository Repository handler
 * @prop {*} util Util handler
 * @prop {*} event Event handler
 * @prop {*} command Command handler
 * @prop {*} routine Routine handler
 */
class Client extends Eris {
    /**
     * Create client.
     * 
     * @param {Object} config Bot settings
     */
    constructor(config) {
        super(config.tokens.discord, config.client);

        this.loaded = false;
        this.config = config;

        this.log = consola;
        this.axios = axios;

        this.repository = new RepositoryHandler(this);
        this.util = new UtilHandler(this);
        this.event = new EventHandler(this);
        this.command = new CommandHandler(this);
        this.routine = new RoutineHandler(this);

        this.on('db', async () => {
            await this.event.loadFiles();
            await this.command.loadFiles();
            await this.routine.loadFiles();

            this.connect();
        });
    }
}

new Client(_config);
