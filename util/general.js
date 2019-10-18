import UtilStructure from '../structures/util';

class GeneralUtil extends UtilStructure {
    constructor(client) {
        super(client);
    }

    list(array) {
        return array.join(', ');
    }

    splitArray(array, size) {
        const temp = array.slice();
        const chunks = [];

        while (temp.length > 0) {
            chunks.push(temp.splice(0, size));
        }

        return chunks;
    }
}

export default GeneralUtil;
