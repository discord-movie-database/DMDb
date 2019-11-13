class MovieEndpoint {
    constructor(wrapper) {
        this.wrapper = wrapper;

        this.base = '/movie';
    }

    getId(query, details) {
        return this.wrapper.getId(query, { imdb_id: /^(tt)(\d+)$/ }, 'movie', details);
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

    async credits(query, options) {
        options = Object.assign({}, options);

        const id = await this.getId(query);
        if (id.error) return id;

        return this.wrapper.getEndpoint(`${this.base}/${id}/credits`, options);
    }

    async popular(options) {
        options = Object.assign({}, options);

        return this.wrapper.getEndpointResults(`${this.base}/popular`, options);
    }

    async similar(query, options) {
        options = Object.assign({}, options);

        const id = await this.getId(query);
        if (id.error) return id;

        return this.wrapper.getEndpointResults(`${this.base}/${id}/similar`, options);
    }

    async videos(query, options) {
        options = Object.assign({}, options);

        const id = await this.getId(query);
        if (id.error) return id;

        return this.wrapper.getEndpointResults(`${this.base}/${id}/videos`, options);
    }

    async upcoming(options) {
        options = Object.assign({}, options);

        return this.wrapper.getEndpointResults(`${this.base}/upcoming`, options);
    }
}

export default MovieEndpoint;
