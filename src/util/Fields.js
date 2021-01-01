import Data from './Data';

import movieTemplate from '../templates/movie';
import showTemplate from '../templates/show';
import personTemplate from '../templates/person';

/**
 * Fields utility.
 *
 * @prop {Object} fields Atomic callable field render functions
 */
export default class Fields extends Data {
    /**
     * Creates an instance of Fields.
     *
     * @param {Object} client Bot client
     */
    constructor(client) {
        super(client);

        this.fields = {
            birthday: (data) => ({
                icon: '🎉',
                name: 'Birthday',
                value: this.date(data.birthday),
            }),

            budget: (data) => ({
                icon: '💸',
                name: 'Budget',
                value: this.money(data.budget),
            }),

            collection: (data) => ({
                icon: '🗃️',
                name: 'Collection',
                value: data.belongs_to_collection
                    ? `[${data.belongs_to_collection.name}]` +
                      `(${this.collectionURL(data.belongs_to_collection.id)})`
                    : this.check(data.belongs_to_collection),
            }),

            created_by: (data) => ({
                icon: '🌱',
                name: 'Created By',
                value: this.list(data.created_by, (person) => person.name),
            }),

            death: (data) => ({
                icon: '🥀',
                name: 'Died',
                value: this.date(data.deathday),
            }),

            episode_runtime: (data) => ({
                icon: '🎞',
                name: 'Episode Runtime',
                value: this.runtime(data.episode_run_time),
            }),

            first_aired: (data) => ({
                icon: '📆',
                name: 'First Aired',
                value: this.date(data.first_air_date),
            }),

            first_aired_short: (data) => ({
                icon: '📆',
                name: 'First Aired',
                value: this.date(data.first_air_date, true),
            }),

            gender: (data) => ({
                icon: this.gender(data.gender, true),
                name: 'Gender',
                value: this.gender(data.gender),
            }),

            genre: (data) => ({
                icon: '🏷️',
                name: this.plural('Genre', data.genres),
                value: this.list(data.genres, (genre) => genre.name),
                inline: false,
            }),

            homepage: (data) => ({
                icon: '🏠',
                name: 'Homepage',
                value: this.check(data.homepage),
                inline: false,
            }),

            imdb: (data) => ({
                icon: '🌐',
                name: 'IMDb',
                value: this.createIMDbURL(data.imdb_id),
            }),

            in_production: (data) => ({
                icon: '🚦',
                name: 'In Production?',
                value: this.yesno(data.in_production),
            }),

            known_for: (data) => ({
                icon: '🎬',
                name: 'Known For',
                value: this.check(data.known_for_department),
            }),

            languages: (data) => ({
                icon: '🗣',
                name: this.plural('Language', data.spoken_languages),
                value: this.list(data.spoken_languages, (lang) => lang.name),
            }),

            last_aired: (data) => ({
                icon: '📅',
                name: 'Last Aired',
                value: this.date(data.last_air_date),
            }),

            network: (data) => ({
                icon: '📡',
                name: this.plural('Network', data.networks),
                value: this.list(data.networks, (network) => network.name),
            }),

            origin_country: (data) => ({
                icon: this.countryFlags(data.origin_country),
                name: this.plural('Origin Countr', data.origin_country, true),
                value: this.list(data.origin_country),
                inline: false,
            }),

            place_of_birth: (data) => ({
                icon: '📍',
                name: 'Place of Birth',
                value: this.check(data.place_of_birth),
                inline: false,
            }),

            production_company: (data) => ({
                icon: '🏢',
                name: this.plural('Production Compan', data.production_companies, true),
                value: this.list(data.production_companies, (company) => company.name),
                inline: false,
            }),

            production_country: (data) => ({
                icon: this.countryFlags(data.production_countries),
                name: this.plural('Production Countr', data.production_countries, true),
                value: this.list(data.production_countries, (country) => country.name),
                inline: false,
            }),

            release_date: (data) => ({
                icon: '📆',
                name: 'Release Date',
                value: this.date(data.release_date),
            }),

            release_date_short: (data) => ({
                icon: '📆',
                name: 'Release Date',
                value: this.date(data.release_date, true),
            }),

            release_year: (data) => ({
                icon: '📆',
                name: 'Release Year',
                value: this.year(data.release_date),
            }),

            revenue: (data) => ({
                icon: '💰',
                name: 'Revenue',
                value: this.money(data.revenue),
            }),

            runtime: (data) => ({
                icon: '🎞',
                name: 'Runtime',
                value: this.runtime(data.runtime),
            }),

            seasons_summary: (data) => ({
                icon: '🧮',
                name: 'Seasons Summary',
                value:
                    `**${this.check(data.number_of_seasons)}** ` +
                    `(${this.check(data.number_of_episodes)} episodes)`,
            }),

            status: (data) => ({
                icon: '🗞',
                name: 'Status',
                value: this.check(data.status),
            }),

            tagline: (data) => ({
                icon: '💬',
                name: 'Tagline',
                value: this.check(data.tagline),
                inline: false,
            }),

            vote_average: (data) => ({
                icon: '⭐',
                name: 'Vote Average',
                value: `**${this.check(data.vote_average)}**`,
            }),

            votes_summary: (data) => ({
                icon: '⭐',
                name: 'Votes Summary',
                value:
                    `**${this.check(data.vote_average)}**` +
                    `${data.vote_average ? ` (${this.number(data.vote_count)} votes)` : ''}`,
            }),

            score_summary: (data) => ({
                icon: '⭐',
                name: 'User Score',
                value:
                    `**${this.score(data.vote_average)}** ` +
                    `${data.vote_average ? ` (${this.number(data.vote_count)} votes)` : ''}`,
            }),

            media_type: (data) => ({
                name: 'Type',
                value: this.titleCase(data.media_type),
            }),

            tmdb_id: (data) => ({
                value: this.TMDbID(data.id),
            }),

            title: (data) => ({
                name: 'Title',
                value: this.check(data.title),
            }),

            name: (data) => ({
                name: 'Name',
                value: this.check(data.name),
            }),

            character: (data) => ({
                name: 'Character',
                value: this.check(data.character),
            }),

            overview: (data) => ({
                value: this.description(data.overview),
            }),

            biography: (data) => ({
                value: this.description(data.biography),
            }),

            spacer: (data) => ({
                name: '—',
                value: '—',
            }),

            index: (data) => ({
                value: `**${data.index}**`,
            }),

            title_or_name: (data) =>
                data.title ? this.fields.title(data) : this.fields.name(data),

            tagline_or_genre: (data) =>
                data.tagline ? this.fields.tagline(data) : this.fields.genre(data),

            votes_summary_or_status: (data) =>
                data.vote_average ? this.fields.votes_summary(data) : this.fields.status(data),

            runtime_or_languages: (data) =>
                data.status === 'Released'
                    ? this.fields.runtime(data)
                    : this.fields.languages(data),
        };

        this.templates = { movie: movieTemplate, show: showTemplate, person: personTemplate };
    }

    /**
     * Sets fields as inline by default.
     *
     * @param {Array<Object>} fields Fields
     * @returns {Array<Object>}
     */
    fieldsLayout(fields) {
        return fields.map((field) => ({ inline: true, ...field }));
    }

    /**
     * Renders field.
     *
     * @param {string} fieldName Field name
     * @param {Object} data Data
     * @returns {Objct}
     */
    renderField(fieldName, data) {
        const field = this.fields[fieldName];

        return field ? field(data) : { name: 'N/A', value: 'N/A' };
    }

    /**
     * Renders fields.
     *
     * @param {Array<string>} fieldNames Field names
     * @param {Object} data Data
     * @returns {Array<Object>}
     */
    renderFields(fieldNames, data) {
        return fieldNames.map((fieldName) => {
            const render = this.renderField(fieldName, data);

            return {
                name: render.icon ? `${render.icon} — ${render.name}` : render.name,
                value: this.check(render.value),
                inline: typeof render.inline === 'boolean' ? render.inline : true,
            };
        });
    }

    /**
     * Gets a custom template using it's name.
     *
     * @param {string} templateName Template name
     * @param {Array<Object>} templates Custom templates
     * @returns {Object}
     */
    findCustomTemplate(templateName, templates) {
        templateName = templateName.toLowerCase();

        for (let i = 0; i < templates.length; i += 1) {
            const template = templates[i];

            if (template.name === templateName) return template;
        }

        return false;
    }

    /**
     * Renders template fields.
     *
     * @param {string} templateName Template name
     * @param {Object} data Data
     * @param {Object} flags Flags
     * @param {Object} guildSettings Guild settings
     * @returns {Array<Object>}
     */
    renderTemplate(mediaName, data, guildSettings, templateName) {
        const defaultTemplates = this.templates[mediaName];

        if (!templateName) {
            if (guildSettings.default_template) {
                const defaultCustomTemplate = this.findCustomTemplate(
                    guildSettings.default_template,
                    guildSettings.templates
                );

                if (defaultCustomTemplate && defaultCustomTemplate.media === mediaName)
                    return this.renderFields(defaultCustomTemplate.fields, data);
            }

            return this.renderFields(defaultTemplates.default, data);
        }

        const customTemplates = guildSettings.templates;
        const customTemplate = this.findCustomTemplate(templateName, customTemplates);

        if (customTemplate && customTemplate.media === mediaName) {
            return this.renderFields(customTemplate.fields, data);
        }

        return this.renderFields(defaultTemplates.default, data);
    }

    /**
     * Renders the data of results.
     *
     * @param {Array<Object>} results Results
     * @param {(Object|Function)} structure Field structure
     * @param {string} structure.name Field name for field name
     * @param {Array<string>} structure.value Field names for field value
     * @returns {Array<Objects>}
     */
    renderResults(results, structure) {
        if (typeof structure === 'object') {
            return results.map((data) => {
                const renderedValueFields = structure.value.map((fieldName) => {
                    const render = this.renderField(fieldName, data);

                    return render.name ? `${render.name}: ${render.value}` : render.value;
                });

                return {
                    name: this.renderField(structure.name, data).value,
                    value: this.join(renderedValueFields),
                };
            });
        }

        return results.map((data) => {
            const field = structure(data);

            if (Array.isArray(field.value) && typeof field.value[0] === 'number')
                field.value[0] = `**${field.value[0]}**`;

            return {
                name: field.name,
                value: Array.isArray ? this.join(field.value) : field.value,
            };
        });
    }

    /**
     * Renders the summary of results.
     *
     * @param {Object} data Result data
     * @returns {string}
     */
    renderResultsSummary(data) {
        const summary = [
            `Current Page: **${data.page}**`,
            `Total Pages: ${data.total_pages}`,
            `Total Results: ${data.total_results}`,
        ];

        if (data.year) summary.push(`Year: ${data.year}`);

        return this.join(summary);
    }
}
