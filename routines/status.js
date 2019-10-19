import RoutineStructure from '../structures/routine';

class StatusRoutine extends RoutineStructure {
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

    run() {
        const value = this.values[this.position]();
        this.client.editStatus({ name: this.prefix + this.seperator + value });

        this.position !== this.values.length - 1 ? this.position++ : this.position = 0;
    }
}

export default StatusRoutine;
