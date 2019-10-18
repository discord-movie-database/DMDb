import RoutineStructure from '../structures/routine';

class StatusRoutine extends RoutineStructure {
    constructor(client) {
        super(client);

        this.intervalDuration = 100 * 60 / 2;
        this.position = 0;

        this.prefix = `${this.client.config.prefix}help`;
        this.seperator = ' | ';

        this.values = [
            () => this.config.status,
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
