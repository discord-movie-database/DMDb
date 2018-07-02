const superagent = require('superagent');
const log = require('./log.js');

const omdb = 'http://omdbapi.com/';
const omdbPoster = 'http://img.omdbapi.com/';
const bitly = 'https://api-ssl.bitly.com/v3/shorten';
const tmdb = 'https://api.themoviedb.org/3/';

const api = module.exports = {};

const getType = (name) => name.startsWith('tt') ? 'i' : 't';

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




api.tmdb = {};

api.tmdb.getMovie = async (query) => {
    const type = getType(query);
    let movie;

    if (type === 'i') {
        movie = await api.get(`${tmdb}find/${query}?api_key=${config.token.tmdb}&language=en-US&external_source=imdb_id`);
        return movie.Error ? movie : movie['movie_results'][0] ? movie['movie_results'][0] : {Error: 'No results found.'}; 
    }

    movie = await api.get(`${tmdb}search/movie?api_key=${config.token.tmdb}&language=en-US&query=${query}&page=1&include_adult=true`);
    return movie.Error ? movie : movie.results[0] ? movie.results[0] : {Error: 'No results found.'}; 
}

api.tmdb.similar = async (query) => {
    const movie = await api.tmdb.getMovie(query);
    if (movie.Error) return movie;

    const movies = await api.get(`${tmdb}movie/${movie.id}/similar?api_key=${config.token.tmdb}&language=en-US&page=1`);
    return movies.results;
}