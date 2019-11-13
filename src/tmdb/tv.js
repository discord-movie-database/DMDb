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

    async details(query, options) {
        options = Object.assign({}, options);

        const id = await this.getId(query);
        if (id.error) return id;

        return this.wrapper.getEndpoint(`${this.base}/${id}`, options);
    }

    async images(query, options) {
        options = Object.assign({}, options);

        const id = await this.getId(query);
        if (id.error) return id;

        return this.wrapper.getEndpoint(`${this.base}/${id}/images`, options);
    }

    async airing(options) {
        options = Object.assign({}, options);

        return this.wrapper.getEndpointResults(`${this.base}/airing_today`, options);
    }
}

export default TvEndpoint;
