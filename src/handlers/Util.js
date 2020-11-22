import Handler from '../structures/Handler';

import Embed from '../util/Embed';
import Fields from '../util/Fields';
import Data from '../util/Data';
import Flags from '../util/Flags';
import Log from '../util/Log';

/**
 * Utility handler.
 */
export default class Util extends Handler {
    /**
     * Creates an instance of Util.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client);

        this.embed = new Embed(this.client);
        this.fields = new Fields(this.client);
        this.data = new Data(this.client);
        this.flags = new Flags(this.client);
        this.log = new Log(this.client);
    }
}
