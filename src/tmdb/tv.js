class TvEndpoint {
    constructor(wrapper) {
        this.wrapper = wrapper;

        this.base = '/tv';
    }

    getId(query, details) {
        return this.wrapper.getId(query, {
            imdb_id: /^(tt)(\d+)$/,
            tvdb_id: /^(tv)(\d+)$/
        }, 'tv', details);
    }

    airing(options) {
        options = Object.assign({}, options);

        return this.wrapper.getEndpointResults(`${this.base}/airing_today`, options);
    }
}

export default TvEndpoint;
