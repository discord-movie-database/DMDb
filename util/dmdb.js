import UtilStructure from '../structures/util';

class DMDbUtil extends UtilStructure {
    constructor(client) {
        super(client);

        this.base = 'https://api.themoviedb.org/3/';
        this.posterSizes = [92, 154, 185, 342, 500, 780];
    }

    /**
     * Toggle TMDb ID prefix "T"
     * 
     * @param {(boolean|string)} ID Old ID
     * @returns {string} Updated ID
     */
    formatTMDbID(ID) {
        ID = ID.toString();

        if (ID.startsWith('t')) return ID.slice(1);
        return `T${ID}`;
    }

    /**
     * Find which API an ID is from
     * 
     * @param {string} id ID
     * @returns {(string|boolean)} probably 'imdb or 'tmdb'
     */
    IDType(ID) {
        let type = ID.match(/^(nm|tt|t)(\d+)/);
        if (!type) return false;
        
        type = type[1];

        if (type === 'nm' || type === 'tt') return 'imdb';
        if (type === 't') return 'tmdb';
    }

    /**
     * Convert IMDb ID into TMDb ID.
     *
     * @param {string} query ID to convert
     * @returns {(string|boolean)} Error or results
     */
    async convertExternalID(query) {
        const API = this.IDType(query);
        if (!API) return this.error('Invalid ID');

        if (API === 'tmdb') return query.slice(1);

        return await this.get(`find/${query}`, {
            'external_source': 'imdb_id' });
    }

    /**
     * Get data from DMDb API with endpoint and parameters
     * 
     * @param {string} endpoint location to retrieve data from API
     * @param {object} params Object of (url) parameters
     * @returns {object} API response
     */
    async get(endpoint, params) {
        return await this._get(this.base, endpoint, {
            ...params, 'api_key': this.client.config.tokens.api.tmdb });
    }

    /**
     * Handle multiple results and pages from API
     * 
     * @param {string} endpoint location to retrieve data from API
     * @param {object} params Object of (url) parameters
     * @returns {object} Array of results
     */
    async getResults(endpoint, params) {
        params = params ? params : {};

        if (endpoint.includes('search') && !params.query)
            return this.error('Query required.');

        const page = params.page && params.page > 0 ? params.page : 1;
        params.page = Math.ceil(page / 4);

        if (params.page > 1000)
            return this.error('Page must be less then or equal to 4000.');

        const results = await this.get(endpoint, params);
        if (results.error) return results;

        results.page = page;
        results.total_pages = Math.ceil(results.total_results / 5);

        if (results.total_results === 0 || page > results.total_pages)
            return this.error('No results found.');

        const subPage = (page - 1) % 4;
        const pagePosition = subPage * 5;

        results.results = results.results.slice(pagePosition, pagePosition + 5)
            .map((result, index) => ({ ...result,
                'index': ((params.page - 1) * 20) + pagePosition + index + 1 }));
        return results;
    }

    /**
     * Get simple data about multiple movies with a query
     * 
     * @param {string} flags Movie name & parameters
     * @returns {object} Error or movies
     */
    async getMovies(flags) {
        const movies = await this.getResults('search/movie', {
            'query': flags.query || flags,
            'page': flags.page,
            'primary_release_year': flags.year
        });

        return movies;
    }

    /**
     * Get a movie's TMDb ID with a query or external ID (IMDb)
     * 
     * @param {string} query Movie name
     * @param {boolean} details More information
     * @returns {string|object} Error or ID
     */
    async getMovieID(query, details) {
        const movieID = await this.convertExternalID(query);
        if (typeof movieID === 'string')
            return details ? await this.getMovie(query) : movieID;

        if (!movieID.error && movieID.movie_results[0]) return details
            ? movieID.movie_results[0] : movieID.movie_results[0].id;

        const movies = await this.getMovies(query);
        if (movies.error) return movies;

        return details ? movies.results[0] : movies.results[0].id;
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
     * @param {string} flags Person name & parameters
     * @returns {object} Error or people
     */
    async getPeople(flags) {
        const people = await this.getResults('search/person', {
            'query': flags.query || flags,
            'page': flags.page
        });

        return people;
    }

    /**
     * Get a movie's TMDb ID with a query or external ID (IMDb)
     * 
     * @param {string} query Movie name
     * @returns {string} Error or ID
     */
    async getPersonID(query, details) {
        const personID = await this.convertExternalID(query);
        if (typeof personID === 'string')
            return details ? await this.getPerson(query) : personID;

        if (!personID.error && personID.person_results[0]) return details
            ? personID.person_results[0] : personID.person_results[0].id;

        const people = await this.getPeople(query);
        if (people.error) return people;

        return details ? people.results[0] : people.results[0].id;
    }

    /**
     * Get detailed data about a person with an ID or query
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
     * Get simple data about TV shows with a query
     * 
     * @param {string} query TV show name
     * @returns {object} Error or TV shows
     */
    async getTVShows(flags) {
        const TVShows = await this.getResults('search/tv', {
            'query': flags.query || flags,
            'page': flags.page,
            'first_air_date_year': flags.year
        });

        return TVShows;
    }

    /**
     * Get a TV show's TMDb ID with a query or external ID (IMDb)
     * 
     * @param {string} query TV show name
     * @returns {string} Error or ID
     */
    async getTVShowID(query, details) {
        const TVShowID = await this.convertExternalID(query);
        if (typeof TVShowID === 'string')
            return details ? await this.getTVShow(query) : TVShowID;

        if (!TVShowID.error && TVShowID.tv_results[0]) return details ?
            TVShowID.tv_results[0] : TVShowID.tv_results[0].id;

        const TVShows = await this.getTVShows(query);
        if (TVShows.error) return TVShows;

        return details ? TVShows.results[0] : TVShows.results[0].id;
    }

    /**
     * Get detailed data about a TV show with an ID or query
     * 
     * @param {string} query TV show name
     * @returns {object} Error or TV show data
     */
    async getTVShow(query) {
        const TVShowID = await this.getTVShowID(query);
        if (TVShowID.error) return TVShowID;

        const TVShow = this.get(`tv/${TVShowID}`);
        return TVShow;
    }

    /**
     * Get popular movies
     * 
     * @returns {object} Error or movies
     */
    async getPopularMovies(flags) {
        const movies = await this.getResults('movie/popular', {
            'page': flags.page
        });

        return movies;
    }

    /**
     * Get popular TV shows
     * 
     * @returns {object} Error or TV shows
     */
    async getPopularTVShows(flags) {
        const shows = await this.getResults('tv/popular', {
            'page': flags.page
        });

        return shows;
    }

    /**
     * Get TV shows airing today
     * 
     * @returns {object} Error or TV shows
     */
    async getTVShowsAiringToday(flags) {
        const shows = await this.getResults('tv/airing_today', {
            'page': flags.page
        });

        return shows;
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
     * Get siliar TV shows with an ID or name
     * 
     * @param {string} query TV show name or ID
     * @returns {object} Error or TV shows
     */
    async getSimilarTVShows(query) {
        const TVShowID = await this.getTVShowID(query);
        if (TVShowID.error) return TVShowID;

        return await this.getResults(`tv/${TVShowID}/similar`);
    }

    _videos(info, videos) {
        if (videos.results.length === 0)
            return this.error('No videos found.');

        return {...info, ...videos};
    }

    /**
     * Get videos for a movie or TV show
     * 
     * @param {string} endpoint Movie or TV show?
     * @param {string} ID Movie or TV show ID
     * @returns {object} Error or trailers
     */
    async getVideos(endpoint, result) {
        const videos = await this.get(`${endpoint}/${result.id}/videos`);
        if (videos.error) return videos;

        if (videos.results.length === 0)
            return this.error('No videos found.');

        return this._videos(result, videos);
    }

    /**
     * Get videos for a movie
     * 
     * @param {string} query Name of movie or ID
     * @returns {object} Error or videos
     */
    async getMovieVideos(query) {
        const movie = await this.getMovieID(query, true);
        if (movie.error) return movie;

        return this.getVideos('movie', movie);
    }

    /**
     * Get videos for a TV show
     * 
     * @param {string} query Name of TV show or ID
     * @returns {object} Error or videos
     */
    async getTVShowVideos(query) {
        const TVShow = await this.getTVShowID(query, true);
        if (TVShow.error) return TVShow;

        return this.getVideos('tv', TVShow);
    }

    /**
     * Reponse handler for credits
     * 
     * @param {object} info Info about credits source
     * @param {object} credits Cast and cew
     * @returns {object} Error or credits
     */
    _credits(info, credits) {
        if (credits.cast.length === 0)
            return this.error('No cast or crew found.');

        return {...info, ...credits};
    }

    /**
     * Get the cast and crew for a movie
     * 
     * @param {string} query Movie name or ID
     * @returns {object} Error or credits
     */
    async getMovieCredits(query) {
        const movie = await this.getMovieID(query, true);
        if (movie.error) return movie;

        const credits = await this.get(`movie/${movie.id}/credits`);
        if (credits.error) return credits;

        return this._credits(movie, credits);
    }

    /**
     * Get the cast and crew for a TV show
     * 
     * @param {string} query TV show name or ID
     * @returns {object} Error or credits
     */
    async getTVShowCredits(query) {
        const TVShow = await this.getTVShowID(query, true);
        if (TVShow.error) return TVShow;

        const credits = await this.get(`tv/${TVShow.id}/credits`);
        if (credits.error) return credits;

        return this._credits(TVShow, credits);
    }

    /**
     * Get the credits of a person
     * 
     * @param {string} query Person or ID
     * @returns {object} Error or credits
     */
    async getPersonCredits(query) {
        const person = await this.getPersonID(query, true);
        if (person.error) return person;

        const credits = await this.get(`person/${person.id}/combined_credits`);
        if (credits.error) return credits;

        return this._credits(person, credits);
    }

    /**
     * Get the user reviews for a movie
     * 
     * @param {string} query Movie name or ID
     * @returns {object} Error or reviews
     */
    async getMovieReviews(flags) {
        const movie = await this.getMovieID(flags.query, true);
        if (movie.error) return movie;

        const reviews = await this.getResults(`movie/${movie.id}/reviews`, {
            page: flags.page });
        if (reviews.error) return reviews;
        
        return {...reviews, ...movie};
    }

    /**
     * Get a poster
     * 
     * @param {string} query Source of poster
     * @returns {object} Error or buffer
     */
    async _getPoster(source, size) {
        const posterPath = source.poster_path || source.profile_path;
        if (!posterPath) return this.error('No poster for this source.');

        size = this.posterSizes[size] || this.posterSizes[2];

        const posterURL = `https://image.tmdb.org/t/p/w${size}${posterPath}`;
        try {
            const image = await request(posterURL);
            return image.body;
        } catch (err) {
            console.log(err);
        }
        return this.error('No poster.');
    }

    /**
     * Get a movie poster with an ID or name
     * 
     * @param {string} query Movie name or ID
     * @param {boolean} size Poster size
     * @returns {object} Error or buffer
     */
    async getMoviePoster(query, size) {
        const movie = await this.getMovie(query);
        if (movie.error) return movie;

        return this._getPoster(movie, size);
    }

    /**
     * Get a TV show poster with an ID or name
     * 
     * @param {string} query TV show name or ID
     * @param {boolean} size Poster size
     * @returns {object} Error or buffer
     */
    async getTVShowPoster(query, size) {
        const TVShow = await this.getTVShow(query);
        if (TVShow.error) return TVShow;

        return this._getPoster(TVShow, size);
    }

    /**
     * Get a person poster with an ID or name
     * 
     * @param {string} query name or ID
     * @param {boolean} size Poster size
     * @returns {object} Error or buffer
     */
    async getPersonPoster(query, size) {
        const person = await this.getPerson(query);
        if (person.error) return person;

        return this._getPoster(person, size);
    }
}

export default DMDbUtil;
