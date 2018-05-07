global.config = require('./config.json');

const Eris = require('eris');

let botToken = config.token.discord;
if (process.argv[2] && process.argv[2] === 'dev') botToken = config.token.devDiscord;
const bot = new Eris(botToken, {
    'maxShards': config.shardCount,
    'disableEveryone': true,
    'disableEvents': {
        'TYPING_START': true,
        'PRESENCE_UPDATE': true
    },
    'autoreconnect': true
});

const handler = require('./handlers/index.js');

let loaded = 0;

bot.on("ready", () => {
    handler.loader.startup();

    bot.editStatus({'name': "!?Help | Movies"});

    if (process.argv[2] !== "dev") handler.stats.list.all(bot);

    console.log(`DMDb ready! In ${bot.guilds.size} guilds.`);
    if (main.dev) console.log('Dev version.');

    loaded = 1;
});

bot.on("messageCreate", async (msg) => {
    if (!msg.author) return;
    if (loaded === 0) return;
    if (msg.author.bot) return;

    let prefix = config.prefix;
    let guild = null;

    if (msg.channel.guild) guild = await handler.db.getGuild(msg.channel.guild.id);
    if (!guild && msg.channel.guild) {
        handler.db.createGuild(msg.channel.guild.id);
        guild = {'id': msg.channel.guild.id};
    }

    const mentionPrefix = `<@${bot.user.id}> `;
    if (guild && guild.prefix) prefix = guild.prefix;
    if (msg.content.startsWith(mentionPrefix)) prefix = mentionPrefix;
    if (!msg.content.startsWith(prefix)) return;

    let user = await handler.db.getUser(msg.author.id);
    if (!user) {
        handler.db.createUser(msg.author.id);
        user = {'id': msg.author.id};
    }

    let msgSplit = msg.content.slice(prefix.length).split(' ');
    let cmdName = msgSplit[0].toLowerCase();

    if (!main.commands[cmdName]) return;
    if (main.commands[cmdName].settings.restricted && msg.author.id !== config.botOwnerId) return;

    let cmdArgs = msgSplit.slice(1);

    try {
        main.commands[cmdName].process(bot, msg, cmdArgs, guild, user, config, handler);
    } catch (err) {
        bot.createMessage(msg.channel.id, '❌ There was an error when executing this command. Try again later.');
        bot.createMessage(config.errorChannelId, `❌ ${err}`);

        console.log(`\n${err}\n`);
    }

    if (user) {
        let count = user.count + 1 || 1;

        handler.db.updateUser(msg.author.id, {'count': count});
    }

    if (msg.channel.guild) {
       let count = guild.count + 1 || 1;
        
        handler.db.updateGuild(msg.channel.guild.id, {'count': count});
    }

    main.executed++;

    handler.log.command(msg, cmdName, cmdArgs);
});

if (process.argv[2] !== 'dev') setInterval(() => {
    handler.stats.list.all(bot);
}, 2700000);

bot.connect();