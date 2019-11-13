class FindEndpoint {
    constructor(wrapper) {
        this.wrapper = wrapper;

        this.base = '/find';
    }

    byExternalId(id, options) {
        options = Object.assign({ external_source: 'imdb_id' }, options);

        return this.wrapper.getEndpoint(`${this.base}/${id}`, options);
    }
}

export default FindEndpoint;
