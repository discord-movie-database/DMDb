const fs = require('fs');

class LoadHandler {
    constructor(client) {
        this.client = client;

        this.eventDirectory = `${__dirname}/../events/`;
        this.commandDirectory = `${__dirname}/../commands/`;
        this.handlerDirectory = `${__dirname}/../handlers/`;
    }

    // MISC //

    _fileName(file, type) {
        file = file.match(/(\w+)\.(\w+)/i);

        if (file[2] === type) return file;
        return false;
    }

    _delete(object, directory, name, type) {
        if (!this.client[object][name]) return false;

        delete this.client[object][name];
        delete require.cache[require.resolve(`${directory}${name}.${type}`)];

        if (this.client[object][name]) return false;
        return true;
    }

    // START / RELOAD //

    start() {
        this.client.handlers.log.info('Bot connnected to Discord.');

        this.loadCommands();
        this.loadEvents();

        this.client.editStatus({ 'name': this.client.config.options.bot.status });

        this.client.handlers.log.success('Bot Finished Loading.');
    }

    reload() {
        this.reloadEvents();
        this.reloadCommands();
    }

    // EVENTS //

    loadEvent(eventName) {
        const Event = require(`${this.eventDirectory}${eventName}.js`);
        this.client.events[eventName] = new Event(this.client);
        
        this.client.on(eventName, this.client.events[eventName].process);
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
        for (eventName in this.client.events)
            this.unloadEvent(eventName);
    }

    reloadEvents() {
        this.unloadEvents();
        this.loadEvents();
    }

    // COMMANDS //

    loadCommand(commandName) {
        const Command = require(`${this.commandDirectory}${commandName}.js`);
        this.client.commands[commandName] = new Command(this.client);
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
        for (commandName in this.client.commands)
            this.unloadCommand(commandName);
    }

    reloadCommands() {
        this.unloadCommands();
        this.loadCommands();
    }
}

module.exports = LoadHandler;