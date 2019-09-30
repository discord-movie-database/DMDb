const fs = require('fs');

class LoadHandler {
    constructor(client) {
        this.client = client;
        this.config = this.client.config;
        
        this.util = this.client.handlers.util;

        this.commandDir = `${__dirname}/../commands`;
        this.eventDir = `${__dirname}/../events`;
        this.handlerDir = __dirname;
    }

    async start() {
        this.client.handlers.log.success('Connected to Discord');
        if (this.client.loaded) return;

        await this.databaseConnect();
        await this.loadCommands()
        await this.loadEvents(); 

        this.client.handlers.botlist.startListInterval();
        this.client.handlers.bot.start();
        this.client.handlers.stats.startStatsInterval();

        this.client.handlers.log.info('Finished Loading');
    }

    async reload() {
        this.client.handlers.log.info('Reloading Bot');

        await this.reloadHandlers();
        await this.reloadEvents();
        await this.reloadCommands();

        this.client.handlers.log.info('Finished Reloading');
    }

    // COMMANDS //

    getCommandNames() {
        return Object.keys(this.client.commands);
    }

    async loadCommand(commandName) {
        try {
            const Command = require(`${this.commandDir}/${commandName}`);
            this.client.commands[commandName] = new Command(this.client);

            this.client.commands[commandName].meta.executed = 0;

            if (this.client.commands[commandName].load)
                this.client.commands[commandName].load();
        } catch (err) {
            this.client.handlers.log.error(`Loading command: ${commandName}`, err);
        }
    }

    async loadCommands(log) {
        const commandDir = fs.readdirSync(this.commandDir);

        for (let i = 0; i < commandDir.length; i++) {
            const fileName = this.util.removeFileExtension(commandDir[i]);
            await this.loadCommand(fileName);
        }

        const commandNames = this.util.list(this.getCommandNames());
        if (!log) this.client.handlers.log.success(`Loaded Commands: ${commandNames}`);
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
        await this.unloadCommands();
        await this.loadCommands(true);

        const commandNames = this.util.list(this.getCommandNames());
        this.client.handlers.log.success(`Reloaded Commands: ${commandNames}`);
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
            this.client.handlers.log.error(`Loading Event: ${eventName}`, err);
        }
    }

    async loadEvents(log) {
        const eventDir = fs.readdirSync(this.eventDir);

        for (let i = 0 ; i < eventDir.length; i++) {
            const eventName = this.util.removeFileExtension(eventDir[i]);
            await this.loadEvent(eventName);
        }

        const eventNames = this.util.list(this.getEventNames());
        if (!log) this.client.handlers.log.success(`Loaded Events: ${eventNames}`);
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
        await this.unloadEvents();
        await this.loadEvents(true);

        const eventNames = this.util.list(this.getEventNames());
        this.client.handlers.log.success(`Reloaded Events: ${eventNames}`);
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
        this.util.deleteRequireCache(`${this.handlerDir}/${handlerName}`);
        delete this.client.handlers[handlerName];
    }

    async reloadHandlers(log) {
        const handlers = this.client.handlers;

        for (let i = 0; i < handlers.length; i++) {
            const handlerName = handlers[i];

            await this.unloadHandler(handlerName);
            await this.loadHandler(handlerName);
        }

        const handlerNames = this.util.list(this.getHandlerNames());
        if (!log) this.client.handlers.log.success(`Reloaded handlers: ${handlerNames}`);
    }

    // DATABASE //

    async databaseConnect() {
        await this.client.handlers.db.connect();

        this.client.handlers.log.success('Connected to Database');
    }
}

module.exports = LoadHandler;
