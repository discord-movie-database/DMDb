const superagent = require('superagent');
const log = require('./log.js');

const omdb = 'http://omdbapi.com/';
const omdbPoster = 'http://img.omdbapi.com/';
const bitly = 'https://api-ssl.bitly.com/v3/shorten';

const api = module.exports = {};

const getType = (name) => {
    return name.startsWith('tt') ? 'i' : 't';
}

api.get = async(request) => {
    let error;
    const { body: response } = await superagent.get(request).catch(e => error = e);
    
    if (error || !response) return {Error: error || 'There was an issue getting the information from the API. Try again later.'};
    return response;
}

api.omdb = async (query) => await api.get(`${omdb}?${query}&apikey=${config.token.omdb}`);
api.shortUrl = async (longUrl) => await api.get(`${bitly}?access_token=${config.token.bitly}&longUrl=${longUrl}&format=json`);

api.getTitle = async (name, year) => await api.omdb(`${getType(name)}=${name}&y=${year}&plot=short&r=json`);
api.searchTitles = async (query, year, page) => await api.omdb(`s=${query}&y=${year}&page=${page}`);

api.getHDPoster = async (id) => {
    if (getType(id) !== 'i') return {Error: 'Must be an IMDb ID.'};

    const image = await api.get(`${omdbPoster}?i=${id}&h=600&apikey=${config.token.omdb}`);
    if (image.Error) return {Error: image.Error};

    return image;
}