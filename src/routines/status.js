import RoutineStructure from '../structures/routine';

/**
 * Status routine. Updates the bot's status message every 30 seconds.
 * 
 * @prop {number} position - ID of current status value
 * @prop {string} prefix - Status message prefix
 * @prop {string} seperator - Status message and prefix seperator
 */
class StatusRoutine extends RoutineStructure {
    /**
     * Create status routine.
     * 
     * @param {Object} client - DMDb client extends Eris
     */
    constructor(client) {
        super(client, 1000 * 60 / 2, { // 30 seconds
            runOnIntervalStart: true,
        });

        this.position = 0;

        this.prefix = `${this.client.config.prefix}help`;
        this.seperator = ' | ';

        this.values = [
            () => 'Movies, TV Shows & People',
            () => `${this.client.guilds.size} Servers`,
            () => `${this.client.users.size} Users`
        ];
    }

    /**
     * Function to run on interval.
     * 
     * @returns {undefined}
     */
    run() {
        const value = this.values[this.position]();
        this.client.editStatus({ name: this.prefix + this.seperator + value });

        this.position !== this.values.length - 1 ? this.position++ : this.position = 0;
    }
}

export default StatusRoutine;
