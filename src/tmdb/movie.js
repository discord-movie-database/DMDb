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
}

export default MovieEndpoint;
