import fs from 'fs';
import consola from 'consola';

/**
 * Handler structure.
 * 
 * @prop {Object} client DMDb client extends Eris
 * @prop {String} handlerName Handler name
 * @prop {String} directory Directory for handler files
 */
class HandlerStructure {
    /**
     * Create handler structure.
     * 
     * @param {Object} client DMDb client extends Eris
     * @param {String} handlerName Handler name
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
     * @param {(Function | undefined)} callback Callback function
     * @returns {undefined}
     */
    async loadFiles(callback) {
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

        if (typeof callback === 'function') callback(this[this.handlerName]);

        consola.success(`Loaded ${this.handlerName}.`);
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

        consola.success(`Unloaded ${this.handlerName}.`);
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
