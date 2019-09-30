/* ************************************

CONTRIBUTING:
- "!" indicates a value you should probably change.

*********************************** **/

const { NODE_ENV } = process.env;

const envConfig = {
    prod: {
        tokens: {
            discord: 'abc123', // !
        },
        
        db: {
            host: 'localhost',
            port: 27017,
            name: 'dmdb',
            options: {
                useNewUrlParser: true,
                user: 'admin',
                pass: 'prodpass', // !
            },
        },
    },

    dev: {
        tokens: {
            discord: 'abc123', // !
        },

        db: {
            host: 'localhost',
            port: 27017,
            name: 'dmdb',
            options: {
                useNewUrlParser: true,
                user: 'admin',
                pass: 'devpass', // !
            },
        },
    },
};

export default {
    env: NODE_ENV,
    ...envConfig[NODE_ENV],

    tokens: {
        tmdb: 'abc123', // !
    },

    list: { // Automatically disabled if value is set to false.
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
            CHANNEL_CREATE: true,
            CHANNEL_DELETE: true,
            CHANNEL_UPDATE: true,
            GUILD_BAN_ADD: true,
            GUILD_BAN_REMOVE: true,
            // GUILD_CREATE: false, // Bot joined guild
            // GUILD_DELETE: false, // Bot kicked / left guild
            GUILD_MEMBER_ADD: true,
            GUILD_MEMBER_REMOVE: true,
            GUILD_MEMBER_UPDATE: true,
            GUILD_ROLE_CREATE: true,
            GUILD_ROLE_DELETE: true,
            GUILD_ROLE_UPDATE: true,
            GUILD_UPDATE: true,
            // MESSAGE_CREATE: false,
            MESSAGE_DELETE: true,
            MESSAGE_DELETE_BULK: true,
            MESSAGE_UPDATE: true,
            PRESENCE_UPDATE: true,
            TYPING_START: true,
            USER_UPDATE: true,
            VOICE_STATE_UPDATE: true,
        },
    },

    prefix: '!?',
    embedColour: 0xE6B91E,
    developers: [ '612086654454333462' ], // !
};
