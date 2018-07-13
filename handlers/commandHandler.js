class CommandHandler {
    constructor(client, info) {
        this.client = client;
        
        this.info = {};

        this.info.name = info.name || false;
        this.info.shortDescription = info.shortDescription || '';
        this.info.longDescription = info.longDescription || '';
        this.info.usage = info.usage || '';
        this.info.visible = typeof info.visible === 'boolean'
            ? info.visible : false;
        this.info.restricted = typeof info.restricted === 'boolean'
            ? info.restricted : true; 
        this.info.weight = info.weight || 0
    }
}

module.exports = CommandHandler;