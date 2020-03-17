import fs from 'fs';
import consola from 'consola';

/**
 * Handler structure.
 * 
 * @prop {Object} client - DMDb client extends Eris
 * @prop {string} handlerName - Handler name
 * @prop {string} directory - Directory for handler files
 */
class HandlerStructure {
    /**
     * Create handler structure.
     * 
     * @param {Object} client - DMDb client extends Eris
     * @param {string} handlerName - Handler name
     */
    constructor(client, handlerName) {
        this.client = client;

        this.handlerName = handlerName;
        this.directory = `${__dirname}/../${handlerName}`

        this[handlerName] = {};
    }

    /**
     * Load handler files.
     * 
     * @returns {undefined}
     */
    async loadFiles() {
        const files = fs.readdirSync(this.directory);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileName = file.match(/^(\w+)\.\w+$/)[1];

            try {
                const File = await import(`${this.directory}/${file}`).then(m => m.default);
                this[this.handlerName][fileName] = new File(this.client);
            } catch (error) {
                consola.error(error);
            }
        }

        if (this.onLoad) this.onLoad(this[this.handlerName]);

        consola.info(`Loaded ${this.handlerName}.`);
    }

    /**
     * Unload handler files.
     * 
     * @returns {undefined}
     */
    unloadFiles() {
        const fileNames = Object.keys(this[handlerName]);

        for (let i = 0; i < fileNames.length; i++) {
            const fileName = fileNames[i];

            delete require.cache[require.resolve(`${this.directory}/${fileName}.js`)];
            delete this.client.commands[commandName];
        }

        consola.info(`Unloaded ${this.handlerName}.`);
    }

    /**
     * Reload handler files.
     * 
     * @returns {undefined}
     */
    reloadFiles() {
        consola.info(`Reloading ${this.handlerName}...`);

        this.unloadFiles();
        this.loadFiles();
    }
}

export default HandlerStructure;
