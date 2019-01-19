const DMDb = require('./dmdb');
const MyAnimeList = require('./myanimelist');

class APIHandler {
    constructor(client) {
        this.dmdb = new DMDb(client);
        this.mal = new MyAnimeList(client);
    }
}

module.exports = APIHandler;