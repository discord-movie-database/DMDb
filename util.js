class Util {
    constructor() { }

    removeFileExtension(file) {
        const fileMatch = file.match(/(\w+)\.(\w+)/i);
        return fileMatch ? fileMatch[1] : file;
    }

    list(array) {
        return array.join(', ');
    }

    deleteRequireCache(file) {
        delete require.cache[require.resolve(file)];
    }
}

module.exports = Util;