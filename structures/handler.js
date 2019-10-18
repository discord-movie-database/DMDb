import fs from 'fs';
import consola from 'consola';

class HandlerStructure {
    constructor(client, handlerName) {
        this.client = client;

        this.handlerName = handlerName;
        this.directory = `${__dirname}/../${handlerName}`

        this[handlerName] = {};
    }

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

    unloadFiles() {
        const fileNames = Object.keys(this[handlerName]);

        for (let i = 0; i < fileNames.length; i++) {
            const fileName = fileNames[i];

            delete require.cache[require.resolve(`${this.directory}/${fileName}.js`)];
            delete this.client.commands[commandName];
        }

        consola.success(`Unloaded ${this.handlerName}.`);
    }

    reloadFiles() {
        consola.info(`Reloading ${this.handlerName}...`);

        this.unloadFiles();
        this.loadFiles();
    }
}

export default HandlerStructure;
