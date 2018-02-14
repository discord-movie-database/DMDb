const superagent = require('superagent');
const config = require('../config.json');

const omdb = 'http://omdbapi.com/';
const omdbToken = `&apikey=${config.token.omdb}`;
const bitly = 'https://api-ssl.bitly.com/v3/shorten';
const apiError = 'API is having issues. Try again later.';

const api = module.exports = {};

const getType = (name) => {
    let type = 't';
    if (name.startsWith('tt')) type = 'i';

    return type;
}

api.getTitle = async (name, year) => {
    let searchYear = year || '';
    let type = getType(name);
    let title;
    try {
        title = await superagent.get(`${omdb}?${type}=${name}&plot=short&r=json&y=${searchYear}${omdbToken}`);
    } catch (err) {
        console.error(err);

        return {"Error": apiError};
    }

    if (title.statusCode != 200) return {"Error": apiError};

    title = title.body;
    return title;
}

api.getPoster = async (name, year) => {
    let title = await api.getTitle(name, year);

    let poster = {};
    poster.Poster = title.Poster;
    poster.Response = title.Response;

    return poster;
}

api.shortUrl = async (url) => {
    let pars = `?access_token=${config.token.bitly}&longUrl=${url}&format=json`;
    let data = await superagent.get(`${bitly}${pars}`);

    if (data.statusCode != 200) return {"Error": apiError};

    data = data.body;
    return data.data.url;
}

api.searchTitles = async (query, year, page) => {
    let searchYear = year || '';
    let searchPage = page || 1;
    let search;
    try {
        search = await superagent.get(`${omdb}?s=${query}&y=${searchYear}&page=${searchPage}${omdbToken}`);
    } catch (err) {
        console.error(err);
        
        return {"Error": apiError};
    }

    if (search.statusCode != 200) return {"Error": apiError};
    
    search = search.body;
    return search;
}