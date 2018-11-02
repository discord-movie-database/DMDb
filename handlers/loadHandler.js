const fs = require('fs');
const { spawn } = require('child_process');

class LoadHandler {
    constructor(client) {
        this.client = client;

        this.eventDirectory = `${__dirname}/../events/`;
        this.commandDirectory = `${__dirname}/../commands/`;
        this.handlerDirectory = `${__dirname}/../handlers/`;

        this.dbAttempt = 0;
    }

    // MISC //

    _fileName(file, type) {
        file = file.match(/(\w+)\.(\w+)/i);

        if (file[2] === type) return file;
        return false;
    }

    _delete(object, directory, name, type) {
        if (!this.client[object][name]) return false;

        if (object === 'events') this.client.removeListener(name, 
            this.client[object][name].process);

        delete this.client[object][name];
        if (object === 'handlers') name += 'Handler';
        delete require.cache[require.resolve(`${directory}${name}.${type}`)];

        if (this.client[object][name]) return false;
        return true;
    }

    // START / RELOAD //

    async start() {
        if (this.client.loaded) return;
        
        this.client.handlers.log.success('Connected to Discord.');

        await this.dbConnect();
        this.loadCommands();
        this.loadEvents();

        this.client.loaded = true;

        this.client.editStatus({
            'name': this.client.config.options.bot.status });

        this.client.handlers.log.success('Finished Loading.\n');

        if (this.client.env === 'main')
            this.client.handlers.list._listInterval();
    }

    reload() {
        this.client.loaded = false;
        let success = true;

        try {
            this.client.handlers.log.info('Reloading...');

            this.reloadBotHandlers();
            this.reloadEvents();
            this.reloadCommands();
            this.dbNewConnection();

            this.client.handlers.log.success('Finished reloading.');
        } catch (err) {
            this.client.loaded = true;
            success = false;

            this.client.handlers.log.error(err);
        }

        return success;
    }

    // EVENTS //

    loadEvent(eventName) {
        const Event = require(`${this.eventDirectory}${eventName}.js`);
        this.client.events[eventName] = new Event(this.client);
        
        this.client.on(eventName, this.client.events[eventName].process);

        this.client.handlers.log.info(`Loaded event: ${eventName}`);
    }

    loadEvents() {
        const events = fs.readdirSync(this.eventDirectory);

        for (let i = 0; i < events.length; i++) {
            const eventName = this._fileName(events[i], 'js');
            if (!eventName) continue;

            this.loadEvent(eventName[1]);
        }
    }
    
    unloadEvent(eventName) {
        return this._delete('events', this.eventDirectory, eventName, 'js');
    }

    unloadEvents() {
        for (let eventName in this.client.events) {

            this.unloadEvent(eventName);
        }
    }

    reloadEvents() {
        this.unloadEvents();
        this.loadEvents();
    }

    // COMMANDS //

    loadCommand(commandName) {
        const Command = require(`${this.commandDirectory}${commandName}.js`);
        this.client.commands[commandName] = new Command(this.client);

        this.client.handlers.log.info(`Loaded command: ${commandName}`);
    }

    loadCommands() {
        const commands = fs.readdirSync(this.commandDirectory);
        
        for (let i = 0; i < commands.length; i++) {
            const commandName = this._fileName(commands[i], 'js');
            if (!commandName) continue;

            this.loadCommand(commandName[1]);
        }
    }

    unloadCommand(commandName) {
        this._delete('commands', this.commandDirectory, commandName, 'js');
    }

    unloadCommands() {
        for (let commandName in this.client.commands)
            this.unloadCommand(commandName);
    }

    reloadCommands() {
        this.unloadCommands();
        this.loadCommands();
    }

    // HANDLERS //

    unloadBotHandler(handler) {
        this._delete('handlers', this.handlerDirectory, `${handler}`, 'js');
    }

    loadBotHandler(handler) {
        const Handler = require(`./${handler}Handler.js`);
        this.client.handlers[handler] = new Handler(this.client);

        if (this.client.handlers.log)
            return this.client.handlers.log.info(`Loaded handler: ${handler}`);
        console.log(`Loaded handler: ${handler}`);
    }

    reloadBotHandlers() {
        for (let handler in this.client.handlers) {
            this.unloadBotHandler(handler);
            this.loadBotHandler(handler);
        }
    }

    async dbConnect() {
        await this.client.handlers.db.connect();
    }

    async dbDisconnect() {
        await this.client.db.disconnect();
    }

    async dbNewConnection() {
        await this.dbDisconnect();
        await this.dbConnect();
    }

    // TODO: new process.
}

module.exports = LoadHandler;