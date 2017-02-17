const superagent = require('superagent');
const config = require('../config.json');
const api = module.exports = {};
const omdb = 'http://svr2.omdbapi.com/';
const bitly = `https://api-ssl.bitly.com/v3/shorten`;

const getType = (name) => {
    let type = 't';
    if (name.startsWith('tt')) type = 'i';
    return type;
}

api.getTitle = async (name) => {
    let type = getType(name);
    let title = await superagent.get(`${omdb}?${type}=${name}&plot=short&r=json`);
    if (title.statusCode != 200) return {"Error": "API is having issues. Try again later."};
    title = title.body;
    return title;
}

api.getPoster = async (name) => {
    let title = await api.getTitle(name);
    let poster = {};
    poster.Poster = title.Poster;
    poster.Response = title.Response;
    return poster;
}

api.shortUrl = async (url) => {
    let pars = `?access_token=${config.token.bitly}&longUrl=${url}&format=json`;
    let data = await superagent.get(`${bitly}${pars}`);
    if (data.statusCode != 200) return {"Error": "API is having issues. Try again later."};
    data = data.body;
    return data.data.url;
}

api.searchTitle = async (keywords) => {
    
}