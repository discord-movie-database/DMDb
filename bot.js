global.config = require('./config.json');

const Eris = require('eris');

let botToken = config.token.discord;
if (process.argv[2] && process.argv[2] === 'dev') botToken = config.token.devDiscord;
const bot = new Eris(botToken, {
    maxShards: config.shardCount,
    disableEveryone: true,
    disableEvents: {
        TYPING_START: true
    },
    autoreconnect: true
});

const handler = require('./handlers/index.js');

let loaded = 0;

bot.on("ready", () => {
    handler.loader.startup();

    bot.editStatus({"name": "[!?Help] Movies, TV and Celebrities"});

    loaded = 1;
    console.log('IMDb Ready!');
    if (main.dev) console.log('Development version.');

    if (process.argv[2] !== "dev") handler.list.post.all(bot);
    handler.scrape.top();
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
        guild = await handler.db.getGuild(msg.channel.guild.id);
    }

    if (guild && guild.prefix) prefix = guild.prefix;
    if (!msg.content.startsWith(prefix)) return;

    let user = await handler.db.getUser(msg.author.id);
    if (!user) {
        handler.db.createUser(msg.author.id);
        user = await handler.db.getUser(msg.author.id);
    }

    let msgSplit = msg.content.split(' ');
    let cmdName = msgSplit[0].toLowerCase().slice(prefix.length);
    if (!main.commands[cmdName]) return;
    if (main.commands[cmdName].settings.restricted && msg.author.id !== config.botOwnerId) return;
    let cmdArgs = msgSplit.slice(1);

    try {
        main.commands[cmdName].process(bot, msg, cmdArgs, guild, user, config, handler);
    } catch (err) {
        bot.createMessage(msg.channel.id, '❌ Uh Oh, there was an error when executing this command. The bot developer has been notified and the issue will be sorted shortly.');
        bot.createMessage(config.errorChannelId, `❌ ${err}`);

        console.log(`\n${err}\n`);
    }

    if (user) {
        let count = user.count + 1 || 1;

        handler.db.updateUser(msg.author.id, {"count": count});
    }

    if (msg.channel.guild) {
       let count = guild.count + 1 || 1;
        
        handler.db.updateGuild(msg.channel.guild.id, {"count": count});
    }

    main.executed++;

    handler.log.command(msg, cmdName, cmdArgs);
});

if (process.argv[2] !== "dev") setInterval(() => {
    if (loaded === 0) return;

    handler.list.post.all(bot);
}, 1800000);

setInterval(() => {
    const topData = handler.scrape.top();
    if (topData) console.log('Scraped new data for top command.');

    handler.loader.cache();
}, 86400000);



bot.connect();