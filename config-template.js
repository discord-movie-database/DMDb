/* ************************************

CONTRIBUTING:
- "!" indicates a value you should probably change.

*********************************** **/

const { NODE_ENV } = process.env;

const envConfig = {
    prod: {
        tokens: {
            discord: 'abc123', // !
            tmdb: 'abc123', // !
        },
        
        db: {
            host: 'localhost',
            port: 27017,
            name: 'dmdb',
            options: {
                useNewUrlParser: true,
                auth: { authSource: 'admin' },
                user: 'admin',
                pass: 'prodpass', // !
            },
        },
    },

    dev: {
        tokens: {
            discord: 'abc123', // !
            tmdb: 'abc123', // !
        },

        db: {
            host: 'localhost',
            port: 27017,
            name: 'dmdb',
            options: {
                useNewUrlParser: true,
                auth: { authSource: 'admin' },
                user: 'admin',
                pass: 'devpass', // !
            },
        },
    },
};

export default {
    env: NODE_ENV,
    ...envConfig[NODE_ENV],

    list: { // Disabled if value is set to false.
        discordBotList: {
            endpoint: 'https://discordbots.org/api',
            token: 'abc123',
        },

        discordBots: {
            endpoint: 'https://discord.bots.gg/api/v1',
            token: 'abc123',
        },

        botsOnDiscord: {
            endpoint: 'https://bots.ondiscord.xyz/bot-api',
            token: 'abc123',
        },

        carbonitex: {
            endpoint: 'https://www.carbonitex.net/discord/data/botdata.php',
            token: 'abc123',
        },
    },

    client: {
        autoreconnect: true,
        maxShards: 2,
        messageLimit: 50,
        disableEveryone: true,
        disableEvents: {
            TYPING_START: true,
            VOICE_STATE_UPDATE: true,
            MESSAGE_DELETE: true,
            MESSAGE_DELETE_BULK: true,
            PRESENCE_UDPATE: true,
        },
    },

    prefix: '!?',
    developers: [ '612086654454333462' ], // !
};
