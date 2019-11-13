class SearchEndpoint {
    constructor(wrapper) {
        this.wrapper = wrapper;

        this.base = '/search';
    }

    movie(query, options) {
        options = Object.assign({ query }, options);

        return this.wrapper.getEndpointResults(`${this.base}/movie`, options);
    }

    tv(query, options) {
        options = Object.assign({ query }, options);

        return this.wrapper.getEndpointResults(`${this.base}/tv`, options);
    }

    person(query, options) {
        options = Object.assign({ query }, options);

        return this.wrapper.getEndpointResults(`${this.base}/person`, options);
    }
}

export default SearchEndpoint;
