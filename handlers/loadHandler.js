const fs = require('fs');
const Util = require('../util.js');

class LoadHandler {
    constructor(client) {
        this.client = client;

        this.util = new Util();

        this.commandDir = `${__dirname}/../commands`;
        this.eventDir = `${__dirname}/../events`;
        this.handlerDir = __dirname;
    }

    async start() {
        if (this.client.loaded) return;

        // START
        this.client.handlers.log.info('Loading');

        // CONNECT TO DATABASE
        await this.databaseConnect();
        this.client.handlers.log.info('Connected to database');

        // LOAD COMMANDS
        await this.loadCommands();
        const commandNames = this.getCommandNames();
        this.client.handlers.log.info(`Loaded commands: ${this.util.list(commandNames)}`);

        // LOAD EVENTS
        await this.loadEvents();
        const eventNames = Object.keys(this.client.events);
        this.client.handlers.log.info(`Loaded events: ${this.util.list(eventNames)}`);

        // UPDATE BOT STATUS
        this.client.editStatus({
            'game': { 'name': this.client.config.options.bot.status } });

        // START BOT LIST STATS INTERVAL
        if (this.client.env === 'main') this.client.handlers.list._listInterval();

        // DONE
        this.client.handlers.log.success('Finished loading');
    }

    async reload() {
        // START
        this.client.handlers.log.info('Reloading');

        // RELOAD HANDLERS
        await this.reloadHandlers();
        const handlerNames = this.getHandlerNames();
        this.client.handlers.log.info(`Reloaded handlers: ${this.util.list(handlerNames)}`);

        // RELOAD EVENTS
        await this.reloadEvents();
        const eventNames = this.getEventNames();
        this.client.handlers.log.info(`Reloaded events: ${this.util.list(eventNames)}`);

        // RELOAD COMMANDS
        await this.reloadCommands();
        const commandNames = this.getCommandNames();
        this.client.handlers.log.info(`Reloaded commands: ${this.util.list(commandNames)}`);

        // DONE
        this.client.handlers.log.success('Finished reloading');
    }

    // COMMANDS //

    getCommandNames() {
        return Object.keys(this.client.commands);
    }

    async loadCommand(commandName) {
        try {
            const Command = require(`${this.commandDir}/${commandName}`);
            this.client.commands[commandName] = new Command(this.client);

            if (this.client.commands[commandName].load)
                this.client.commands[commandName].load();
        } catch (err) {
            this.client.handlers.log.error(`Loading command: ${commandName}`, err);
        }
    }

    async loadCommands() {
        const commandDir = fs.readdirSync(this.commandDir);

        for (let i = 0; i < commandDir.length; i++) {
            const fileName = this.util.removeFileExtension(commandDir[i]);
            await this.loadCommand(fileName);
        }
    }

    async unloadCommand(commandName) {
        this.util.deleteRequireCache(`${this.commandDir}/${commandName}`);
        delete this.client.commands[commandName];
    }

    async unloadCommands() {
        const commandNames = this.getCommandNames();

        for (let i = 0; i < commandNames.length; i++) {
            const commandName = commandNames[i];
            await this.unloadCommand(commandName);
        }
    }

    async reloadCommands() {
        this.unloadCommands();
        this.loadCommands();
    }

    // EVENTS //

    getEventNames() {
        return Object.keys(this.client.events);
    }

    async loadEvent(eventName) {
        try {
            const Event = require(`${this.eventDir}/${eventName}`);
            this.client.events[eventName] = new Event(this.client);

            this.client.on(eventName, this.client.events[eventName].process);
        } catch (err) {
            this.client.handlers.log.error(`Loading event: ${eventName}`, err);
        }
    }

    async loadEvents() {
        const eventDir = fs.readdirSync(this.eventDir);

        for (let i = 0 ; i < eventDir.length; i++) {
            const eventName = this.util.removeFileExtension(eventDir[i]);
            await this.loadEvent(eventName);
        }
    }

    async unloadEvent(eventName) {
        this.util.deleteRequireCache(`${this.eventDir}/${eventName}`);
        this.client.removeListener(eventName, this.client.events[eventName].process);
        delete this.client.events[eventName];
    }
    
    async unloadEvents() {
        const eventNames = this.getEventNames();

        for (let i = 0; i < eventNames.length; i++) {
            const eventName = eventNames[i];
            await this.unloadEvent(eventName);
        }
    }

    async reloadEvents() {
        this.unloadEvents();
        this.loadEvents();
    }

    // HANDLERS //

    getHandlerNames() {
        return Object.keys(this.client.handlers);
    }

    async loadHandler(handlerName) {
        try {
            const Handler = require(`${this.handlerDir}/${handlerName}`);
            this.client.handlers[handlerName] = new Handler(this.client);
        } catch (err) {
            this.client.handlers.log.error(`Loading handler: ${handlerName}`, err);
        }
    }

    async unloadHandler(handlerName) {
        this.util.deleteRequireCache(`${this.handlerDir}/${handlerName}Handler`);
        delete this.client.handlers[handlerName];
    }

    async reloadHandlers() {
        const handlers = this.client.handlers;

        for (let i = 0; i < handlers.length; i++) {
            const handlerName = handlers[i];
            await this.unloadHandler(handlerName);
            await this.loadHandler(handlerName);
        }
    }

    // DATABASE //

    async databaseConnect() {
        await this.client.handlers.db.connect();
    }

    async databaseDisconnect() {
        await this.client.db.disconnect();
    }

    async databaseReconnect() {
        await this.databaseDisconnect();
        await this.databaseConnect();
    }
}

module.exports = LoadHandler;