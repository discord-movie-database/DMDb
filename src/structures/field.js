/**
 * Field structure.
 *
 * @prop {Object} client - DMDb client extends Eris
 */
class FieldStructure {
    /**
     * Create field structure.
     *
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Fetch a key from our late-set data.
     *
     * @param {string} key - Key
     * @returns {string} - Value (pre-formatting)
     */
    data(key) {
        return this.client.field.data[key];
    }


    // TODO: fully decouple all of these formatters out of CommandHandler
    // (without over-complicating the simpler command templates, hopefully)


    /**
     * Returns "N/A" if there is no value.
     *
     * @param {string} value - Value
     * @returns {string} - Original value or "N/A"
     */
    check(value) {
        return value ? value.toString() : 'N/A';
    }

    /**
     * Returns size of array.
     *
     * @param {boolean} value - Value
     * @returns {string} - Updated value
     */
    size(values) {
        return values ? values.length : this.check(values);
    }

    /**
     * Converts boolean to yes or no.
     *
     * @param {boolean} value - Value
     * @returns {string} - Updated value
     */
    yesno(value) {
        return value ? 'Yes' : 'No';
    }

    /**
     * Converts time into human readable.
     *
     * @param {string} value - Value
     * @returns {string} - Updated value
     */
    date(value) {
        if (!value) return this.check(value);

        const date = new Date(value);

        let day = date.getDate();
        let month = date.getUTCMonth();
        let year = date.getFullYear();

        day = month && day ? `${day} ` : '';
        month = month ? `${this.months[month]} ` : '';
        year = year ? year : '';

        return day + month + year;
    }

    /**
     * Get year from date.
     *
     * @param {string} value - Value
     * @returns {string} - Updated value
     */
    year(value) {
        return value ? new Date(value).getFullYear() : this.check(value);
    }

    /**
     * Converts money value to readable.
     *
     * @param {string} value - Value
     * @returns {string} - Updated value
     */
    money(value) {
        return value ? `$${value.toLocaleString()}` : this.check(value);
    }

    /**
     * Converts number to readable.
     *
     * @param {number} value - Value
     * @returns {string} - - Updated value
     */
    number(value) {
        return value ? value.toLocaleString('en-US') : this.check(value);
    }

    /**
     * Converts gender value to readable.
     *
     * @param {number} value - Value
     * @returns {string} - Updated value
     */
    gender(value) {
        return value ? value === 2 ? 'Male' : 'Female' : this.check(value);
    }

    /**
     * Format duration.
     *
     * @param {string} value - Value
     * @return {string} - Updated value
     */
    duration(value) {
        const hours = Math.floor(value / 60);
        const minutes = value % 60;

        const _hours = hours ? `${hours} Hour${hours > 1 ? 's' : ''} ` : '';
        const _minutes = minutes ? `${minutes} Minute${minutes > 1 ? 's' : ''}` : '';

        return _hours + _minutes;
    }

    /**
     * Converts runtime value to readable.
     *
     * @param {string} value - Value
     * @returns {string} - Updated value
     */
    runtime(value) {
        return value ? Array.isArray(value) ? value.map((r) => this.duration(r)).join(', ')
            : this.duration(value) : this.check(value);
    }
}

export default FieldStructure;
