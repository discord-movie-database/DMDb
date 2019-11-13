class SearchEndpoint {
    constructor(wrapper) {
        this.wrapper = wrapper;

        this.base = '/search';
    }

    movie(query, options) {
        options = Object.assign({ query, page: 1 }, options);

        return this.wrapper.getEndpoint(`${this.base}/movie`, options);
    }
}

export default SearchEndpoint;
