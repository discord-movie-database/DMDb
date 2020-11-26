import Util from '../structures/Util';

/**
 * Flags utility.
 *
 * @prop {Object} flags Valid flags
 */
export default class Flags extends Util {
    /**
     * Creates an instance of Flags.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client);

        this.flags = {
            page: { argsRequired: true, desc: 'Get more results.' },
            year: { argsRequired: true, desc: 'Get results from a specific year.' },
            show: { argsRequired: false, desc: 'Get results for TV shows.' },
            person: { argsRequired: false, desc: 'Get results for people.' },
            reset: { argsRequired: false, desc: 'Reset some config options.' },
            template: { argsRequired: true, desc: 'Use a custom template.' },
        };
    }

    /**
     * Parses flags in input.
     *
     * @param {string} input Input value
     * @returns {Object}
     */
    parse(input, valid) {
        const flags = {};

        if (valid.indexOf('year') > -1) {
            const yearFormat = /\((\d{4})\)/;
            const hasYear = input.match(yearFormat);

            if (hasYear) {
                flags.year = hasYear[1];

                input = input.replace(yearFormat, '');
            }
        }

        const split = input.trim().split(' ');

        for (let i = 0; i < split.length; i += 1) {
            let argument = split[i];

            if (argument && argument.startsWith('--')) {
                argument = argument.slice(2).toLowerCase();

                const flag = this.flags[argument];

                if (valid.indexOf(argument) > -1 && flag) {
                    if (flag.argsRequired) {
                        flags[argument] = split[i + 1];

                        split.splice(i, 2);
                        i -= 2;
                    } else {
                        flags[argument] = true;

                        split.splice(i, 1);
                        i -= 1;
                    }
                }
            }
        }

        return { ...flags, output: split.join(' ') };
    }

    /**
     * Checks if year flag is valid.
     *
     * @param {string} value Value
     * @returns {string}
     */
    year(value) {
        return value && /^\d{4}$/.test(value) ? value : 'All';
    }
}
