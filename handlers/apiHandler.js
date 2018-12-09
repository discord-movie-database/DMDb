const request = require('superagent'); 

class apiHandler {
    constructor(client) {
        this.client = client;

        this.base = `https://api.themoviedb.org/3/`;
    }

    /**
     * Convert error message string into a object
     * 
     * @param {string} message error message
     * @returns {object} error object
     */
    error(message) {
        return { 'error': message };
    }

    /**
     * Toggle TMDb ID prefix "T"
     * for example, IMDb uses "tt"
     * 
     * @param {(boolean|string)} id Old ID
     * @returns {string} Updated ID
     */
    updateID(ID) {
        if (ID.startsWith('T')) return ID.slice(1);
        return `T${ID}`;
    }

    /**
     * Find which API an ID is from
     * 
     * @param {string} id ID
     * @returns {(string|boolean)} probably 'imdb or 'tmdb'
     */
    IDType(ID) {
        let type = ID.match(/^(nm|tt|T)(\d+)/);
        if (!type) return false;
        
        type = type[1];

        if (type === 'nm') return 'imdb';
        if (type === 'tt') return 'imdb';

        if (type === 'T') return 'tmdb';
    }

    /**
     * Convert IMDb ID into TMDb ID.
     * > USES API
     *
     * @param {string} query Possible ID to convert
     * @returns {(string|boolean)} Error or TMDb ID
     */
    async convertExternalID(query) {
        const API = this.IDType(query);
        if (!API) return this.error('Invalid ID');

        if (API === 'tmdb') return query.slice(1);

        if (API === 'imdb') {
            const results = this.get(`find/${query}`, {
                'external_source': 'imdb_id' });
            if (results.error) return results;

            if (results.movie_results[0])
                return this.formatID(results.movie_results[0].id);

            if (results.person_results[0])
                return this.formatID(results.person_results[0].id);
        }
    }

    /**
     * Get data from API with endpoint and parameters
     * 
     * @param {string} endpoint location to retrieve data from API
     * @param {object} params Object of (url) parameters
     * @returns {object} API response
     */
    async get(endpoint, params) {
        params = params || {};

        let parsedParams = `?api_key=${this.client.config.tokens.api.tmdb}`;
        for (let param in params) parsedParams += `&${param}=${params[param]}`;

        const requestURL = this.base + endpoint + parsedParams;

        let response;
        try {
            response = await request.get(requestURL);
        } catch (err) { console.log(err); }
        if (!response || response.statusCode !== 200) return this.error('API Error. Try again later.');

        return response.body;
    }

    /**
     * Handle multiple results and pages from API
     * 
     * @param {string} endpoint location to retrieve data from API
     * @param {object} params Object of (url) parameters
     * @returns {object} Array of results
     */
    async getResults(endpoint, params) {
        const results = await this.get(endpoint, params);
        if (results.error) return results;

        if (results.total_results === 0)
            return this.error('No results found.');

        // TODO: Handle pages

        return results;
    }

    /**
     * Get simple data about multiple movies with a query
     * 
     * @param {string} query Movie name
     * @returns {object} Error or movies
     */
    async getMovies(query) {
        const movies = await this.getResults('search/movie', {
            'query': query });
        
        return movies;
    }

    /**
     * Get a movies TMDb ID with a query or external ID (IMDb)
     * 
     * @param {string} query Movie name
     * @returns {string} Error or ID
     */
    async getMovieID(query) {
        let movieID = await this.convertExternalID(query);
        if (!movieID.error) return movieID;

        const movies = await this.getMovies(query);
        if (movies.error) return movies;

        return movies.results[0].id;
    }

    /**
     * Get detailed data about a movie with an ID or query
     * 
     * @param {string} query Movie name
     * @returns {object} Error or movie data
     */
    async getMovie(query) {
        const movieID = await this.getMovieID(query);
        if (movieID.error) return movieID;

        const movie = this.get(`movie/${movieID}`);
        return movie;
    }

    /**
     * Get simple data about people with a query
     * 
     * @param {string} query Person name
     * @returns {object} Error or people
     */
    async getPeople(query) {
        const people = await this.getResults('search/person', {
            'query': query });

        return people;
    }

    /**
     * Get a movies TMDb ID with a query or external ID (IMDb)
     * 
     * @param {string} query Movie name
     * @returns {string} Error or ID
     */
    async getPersonID(query) {
        let personID = await this.convertExternalID(query);
        if (!personID.error) return personID;

        const people = await this.getPeople(query);
        if (people.error) return people;

        return people.results[0].id;
    }

    /**
     * Get detailed data about a person with an ID or name
     * 
     * @param {string} query Person name
     * @returns {object} Error or person data
     */
    async getPerson(query) {
        const personID = await this.getPersonID(query);
        if (personID.error) return personID;

        const person = this.get(`person/${personID}`);
        return person;
    }

    /**
     * Get upcoming movies in theatres
     * 
     * @returns {object} Error or movies
     */
    async getUpcomingMovies() {
        const movies = await this.getResults('movie/upcoming');
        if (movies.error) return movies;

        return movies;
    }

    /**
     * Get siliar movies with an ID or name
     * 
     * @param {string} query Movie name or ID
     * @returns {object} Error or movies
     */
    async getSimilarMovies(query) {
        const movieID = await this.getMovieID(query);
        if (movieID.error) return movieID;

        return await this.getResults(`movie/${movieID}/similar`);
    }

    /**
     * Get movie trailers with an ID or name
     * 
     * @param {string} query Movie name or ID
     * @returns {object} Error or trailers
     */
    async getTrailers(query) {
        const movieID = await this.getMovieID(query);
        if (movieID.error) return movieID;

        const videos = await this.get(`movie/${movieID}/videos`);
        if (videos.error) return videos;

        if (videos.results.length === 0)
            return this.error('No trailers found.');

        return videos.results.filter(video =>
            video.site === "YouTube" && video.type === "Trailer");
    }

    /**
     * Get a movie poster with an ID or name
     * 
     * @param {string} query Movie name or ID
     * @returns {object} Error or buffer
     */
    async getPoster(query) {
        const movie = await this.getMovie(query);
        if (movie.error) return movie;

        const posterPath = movie.poster_path;
        if (!posterPath) return this.error('No poster for this movie.');

        const posterURL = `https://image.tmdb.org/t/p/w500${posterPath}`;
        try {
            const image = await request(posterURL);
            return image.body;
        } catch (err) {
            console.log(err);
        }
        return this.error('No poster.');
    }
}

module.exports = apiHandler;