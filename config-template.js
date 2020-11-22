const { NODE_ENV } = process.env || 'dev';

const envConfig = {
    prod: null, // Same structure as dev config but you probably want different values

    dev: {
        tokens: {
            discord: 'abc123', // Discord bot token
            tmdb: 'abc123', // TMDb API token https://www.themoviedb.org/documentation/api
        },

        db: {
            host: 'localhost',
            port: 27017,
            name: 'dmdb',

            options: {
                useUnifiedTopology: true,
                useNewUrlParser: true,

                auth: { authSource: 'admin' },
                user: 'admin',
                pass: 'devpass', // Database password
            },
        },
    },
};

export default {
    env: NODE_ENV,

    ...envConfig[NODE_ENV],

    list: false, // Configs for bot list sites

    client: {
        autoreconnect: true,
        maxShards: 1, // Discord requires a new instance for every 2500 guilds
        messageLimit: 50,
        disableEveryone: true,

        // These disabled events help improve performance
        disableEvents: {
            TYPING_START: true,
            VOICE_STATE_UPDATE: true,
            MESSAGE_DELETE: true,
            MESSAGE_DELETE_BULK: true,
            PRESENCE_UDPATE: true,
            MESSAGE_PIN: true,
            MESSAGE_UNPIN: true,
        },
    },

    prefix: '!?',
    developers: ['612086654454333462'], // Snowflakes of users who have access to developer features

    // API wrapper settings
    wrapper: {
        custom_id: true,
        results_per_page: 5,
        always_use_results: true,
    },
};
