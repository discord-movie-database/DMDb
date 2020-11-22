/* eslint-disable prettier/prettier */

export default {
    supports: [
        'budget',
        'collection',
        'genre',
        'homepage',
        'imdb',
        'languages',
        'production_company',
        'production_country',
        'release_date',
        'revenue',
        'runtime',
        'score_summary',
        'votes_summary',
        'status',
        'tagline',
        'spacer',
    ],

    default: [
        'tagline_or_genre',
        'votes_summary_or_status',
        'release_date',
        'runtime_or_languages'
    ],
};
