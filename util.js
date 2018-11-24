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

    chunkArray(array, chunkSize) {
        const tempArray = array.slice();
        const chunks = [];

        while (tempArray.length > 0)
            chunks.push(tempArray.splice(0, chunkSize));

        return chunks;
    }
}

module.exports = Util;