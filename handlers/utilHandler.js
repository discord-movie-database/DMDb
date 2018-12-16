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

    flags(query) {
        const words = query.split(' ');
        const response = {};

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            
            if (word.startsWith('--')) {
                const flagName = word.slice(2);
                const flagValue = words[i + 1];

                if (flagName !== 'query' && flagValue)
                    response[flagName] = flagValue;

                words.splice(i, 2);
            }
        }

        response.query = words.join(' ');
        return response;
    }
}

module.exports = Util;