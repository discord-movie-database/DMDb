class UtilHelper {
    constructor(client) {
        this.client = client;
    }

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

        while (tempArray.length > 0) {
            chunks.push(tempArray.splice(0, chunkSize));
        }

        return chunks;
    }
    
    flags(query, possibleFlags) {
        const queryArguments = query.split(' ');
        const presentFlags = {};

        for (let i = 0; i < queryArguments.length; i++) {
            let argument = queryArguments[i];
            
            // Check if the argument starts with flag prefix "--"
            if (!argument || !argument.startsWith('--')) continue;
            argument = argument.slice(2).toLowerCase(); // Remove the prefix from flag name

            // Check if the flag is valid
            if (possibleFlags.indexOf(argument) < 0) continue;

            if (this.client.flags[argument].requiresArguments) {
                presentFlags[argument] = queryArguments[i + 1]; // Flag present with argument
                
                // Remove the flag name and argument from the query
                queryArguments.splice(i, 2);
                i = i - 2;
            } else {
                presentFlags[argument] = true; // Flag present but no argument

                // Remove the flag name from the query
                queryArguments.splice(i, 1);
                i = i - 1;
            }
        }

        query = queryArguments.join(' ');
        return { query, ...presentFlags };
    }
}

module.exports = UtilHelper;
