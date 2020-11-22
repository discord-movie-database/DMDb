/* eslint-disable prettier/prettier */

export default {
    supports: [
        'created_by',
        'episode_runtime',
        'first_aired',
        'genre',
        'homepage',
        'imdb',
        'in_production',
        'last_aired',
        'network',
        'origin_country',
        'production_company',
        'score_summary',
        'seasons_summary',
        'status',
        'tagline',
        'type',
        'votes_summary',
        'spacer',
    ],

    default: [
        'tagline_or_genre',
        'votes_summary_or_status',
        'first_aired',
        'episode_runtime'
    ],
};
