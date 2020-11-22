import Eris from 'eris';
import { V3 } from 'tmdb';

import config from '../config';

import Repository from './handlers/Repository';
import Util from './handlers/Util';
import Event from './handlers/Event';
import Command from './handlers/Command';
import Routine from './handlers/Routine';

/**
 * Discord Movie Database (DMDb)
 *
 * @prop {boolean} loaded Has bot finished loading?
 * @prop {Object} config Bot configuration
 * @prop {Repository} repo Repository handler
 * @prop {Util} util Util handler
 * @prop {Event} event Event handler
 * @prop {Command} command Command handler
 * @prop {Routine} routine Routine handler
 * @prop {V3} tmdb TMDb API wrapper
 * @prop {function} getChannelCount Gets the channel count
 */
class DMDb extends Eris {
    /**
     * Creates an instance of DMDb.
     */
    constructor() {
        super(config.tokens.discord, config.client);

        this.config = config;
        this.loaded = false;
        this.start = new Date();

        this.util = new Util(this);
        this.repo = new Repository(this);
        this.event = new Event(this);
        this.command = new Command(this);
        this.routine = new Routine(this);

        this.tmdb = new V3({ api_key: config.tokens.tmdb }, this.config.wrapper);

        this.on('db', async () => {
            this.connect();

            await this.event.loadEvents();
            await this.command.loadCommands();
            await this.routine.loadRoutines();
        });

        this.repo.connect();
    }
}

new DMDb();
