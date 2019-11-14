class SearchEndpoint {
    constructor(wrapper) {
        this.wrapper = wrapper;

        this.base = '/search';
    }

    movie(query, options) {
        options = Object.assign({ query }, options);
        options.primary_release_year = options.year;

        return this.wrapper.getEndpointResults(`${this.base}/movie`, options);
    }

    tv(query, options) {
        options = Object.assign({ query }, options);
        options.first_air_date_year = options.year;

        return this.wrapper.getEndpointResults(`${this.base}/tv`, options);
    }

    person(query, options) {
        options = Object.assign({ query }, options);

        return this.wrapper.getEndpointResults(`${this.base}/person`, options);
    }
}

export default SearchEndpoint;
