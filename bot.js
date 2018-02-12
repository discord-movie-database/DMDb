const config = require('./config.json');

const Eris = require('eris');

let botToken = config.token.discord;
if (process.argv[2] && process.argv[2] === "dev") botToken = config.token.devDiscord;
const bot = new Eris(botToken, {
    maxShards: config.shardCount,
    disableEveryone: true,
    disableEvents: {
        TYPING_START: true
    },
    autoreconnect: true
});

const handler = require('./handlers/index.js');

global.main = {};
let loaded = 0;

bot.on("ready", () => {
    main.executed = 0;

    handler.loader.loadCommands();

    bot.editStatus({"name": "[!?Help] Movies, TV and Celebrities"});
    console.log('IMDb Ready!');

    loaded = 1;

    if (!process.argv[2] === "dev") handler.post.all(bot);
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
        let count = 1;

        if (user.count) count = user.count + 1;
        handler.db.updateUser(msg.author.id, {"count": count});
    }

    if (msg.channel.guild) {
        let count = 1;

        if (guild.count) count = guild.count + 1;
        handler.db.updateGuild(msg.channel.guild.id, {"count": count});
    }

    main.executed++;

    let logMsg = `${msg.author.username} (${msg.author.id}) executed ${cmdName}`;
    if (msg.channel.guild) logMsg += ` in ${msg.channel.name} (${msg.channel.id}) in ${msg.channel.guild.name} (${msg.channel.guild.id})`;
    if (!msg.channel.guild) logMsg += ' in a direct message';
    if (cmdArgs[0]) logMsg += ` with the args ${cmdArgs.join(' ')}`;

    console.log(logMsg);
});

if (!process.argv[2] === "dev") setInterval(() => {
    if (loaded === 0) return;

    handler.post.all(bot);
}, 1800000);

setInterval(() => {
    const topData = handler.scrape.top();

    if (topData) console.log('Scraped new data for top command.');
}, 86400000);

bot.connect();