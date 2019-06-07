const Command = require('../../helpers/command'); 

class Option extends Command {
    constructor(client, info) {
        super(client);

        this.info = {};
        this.info.name = info.name;
        this.info.description = info.description;
        this.info.usage = info.usage;

        this.dbHandler = this.client.handlers.db;

        this.commandKeys = Object.keys(this.client.commands);
    }
}

module.exports = Option;
