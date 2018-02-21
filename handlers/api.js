const superagent = require('superagent');
const log = require('./log.js');

const omdb = 'http://omdbapi.com/';
const omdbPoster = 'http://img.omdbapi.com/';
const omdbToken = `&apikey=${config.token.omdb}`;
const bitly = 'https://api-ssl.bitly.com/v3/shorten';

const api = module.exports = {};

const getType = (name) => {
    let type = 't';
    if (name.startsWith('tt')) type = 'i';

    return type;
}

api.getTitle = async (name, year) => {
    const errorMsg = `Cannot get title ${name} from the API.`;

    const type = getType(name);

    let title = {};
    try {
        const raw = await superagent.get(`${omdb}?${type}=${name}&plot=short&r=json&y=${year}${omdbToken}`);
        if (raw.statusCode != 200) title.Error = `${errorMsg} Try again later.`;

        title = raw.body;
    } catch (err) {
        log.error(err, errorMsg);
        title.Error = `${errorMsg} Try again later.`;
    }

    return title;
}

api.searchTitles = async (query, year, page) => {
    const errorMsg = 'Cannot get search results from the API.';

    let search = {};
    try {
        const raw = await superagent.get(`${omdb}?s=${query}&y=${year}&page=${page}${omdbToken}`);
        if (raw.statusCode != 200) search.Error = `${errorMsg} Try again later.`;

        search = raw.body;
    } catch (err) {
        log.error(err, errorMsg);
        search.Error = `${errorMsg} Try again later.`;
    }

    return search;
}

api.getPoster = async (name, year) => {
    const title = await api.getTitle(name, year);

    const poster = {};
    poster.Poster = title.Poster;
    poster.Response = title.Response;
    if (title.Error) poster.Error = title.Error;

    return poster;
}

api.getHDPoster = async (name) => {
    const errorMsg = 'Cannot get poster from the API.';
    const errorMsg404 = 'Title doesn\'t exist or doesn\'t have a poster.';

    const type = getType(name);

    const poster = {};
    try {
        const raw = await superagent.get(`${omdbPoster}?i=${name}&h=600${omdbToken}`).buffer(true).parse(superagent.parse.image);
        if (raw.statusCode != 200) poster.Error =  errorMsg;
        if (raw.statusCode === 404) poster.Error = errorMsg404;

        poster.data = raw.body;
    } catch (err) {
        log.error(err, errorMsg);
        poster.Error = errorMsg;
    }

    return poster;
}

api.shortUrl = async (url) => {
    const errorMsg = 'Cannot shorten URL.';

    let data = {};
    try {
        data = await superagent.get(`${bitly}?access_token=${config.token.bitly}&longUrl=${url}&format=json`);
        if (data.statusCode != 200) data.Error = errorMsg;

        data = data.body.data;
    } catch (err) {
        log.error(err, errorMsg);
        data.Error = errorMsg;
    }

    return data;
}