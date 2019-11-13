import UtilStructure from '../structures/util';

/**
 * Flags util.
 * 
 * @prop {Object} flagOptions Flag options
 */
class FlagsUtil extends UtilStructure {
    /**
     * Create flags util structure.
     * 
     * @param {Object} client DMDb client extends Eris
     */
    constructor(client) {
        super(client);

        this.flagOptions = {
            page: { argRequired: true, desc: 'Get more results.' },
            year: { argRequired: true, desc: 'Get results from a specific year.' },
            show: { argRequired: false, desc: 'Get a result for a TV show instead of a movie.' },
            shows: { argRequired: false, desc: 'Get results for TV shows instead of movies.' },
            person: { argRequired: false, desc: 'Get a result for a person instead of a movie.' },
            more: { argRequired: false, desc: 'Get more information for a result.' }
        };
    }

    /**
     * Parse flags in query.
     * 
     * @param {string} query Query to parse for flags
     * @param {Array} possibleFlags Flags to parse
     * @returns {Object} Parsed flags and updated query
     */
    parse(query, possibleFlags) {
        const queryArguments = query.split(' ');
        const presentFlags = {};
    
        for (let i = 0; i < queryArguments.length; i++) {
            let argument = queryArguments[i];
            
            if (!argument || !argument.startsWith('--')) continue;
            argument = argument.slice(2).toLowerCase();
    
            if (possibleFlags.indexOf(argument) < 0) continue;
    
            if (this.flagOptions[argument].argRequired) {
                presentFlags[argument] = queryArguments[i + 1];
                
                queryArguments.splice(i, 2);
                i = i - 2;
            } else {
                presentFlags[argument] = true;

                queryArguments.splice(i, 1);
                i = i - 1;
            }
        }
    
        query = queryArguments.join(' ');
        return { query, ...presentFlags };
    }

    /**
     * Checks if year flag is valid.
     * 
     * @param {String} value Value
     * @returns {String} Updated value
     */
    year(value) {
        return value && /^\d{4}$/.test(value) ? value : 'All';
    }
}

export default FlagsUtil;
