const config = require('./config.json');
const Eris = require('eris');
const bot = new Eris(config.token.bot, {
    maxShards: config.shardCount,
    disableEveryone: true,
    disableEvents: {
        TYPING_START: true
    },
    autoreconnect: true
});
const u = require('./util/main.js');
global.main = {};
let loaded = 0;

bot.on("ready", () => {
    u.commands.loadCommands();
    bot.editStatus({"name": "[!?Help] Movies, TV and Celebrities"});
    console.log('IMDb Ready!');
    loaded = 1;
});

bot.on("messageCreate", async (msg) => {
    if (!msg.author) return;
    if (msg.author.bot) return;
    if (loaded === 0) return;
    let prefix = config.prefix;
    let guild = null;
    if (msg.channel.guild) guild = await u.db.getGuild(msg.channel.guild.id);
    if (!guild && msg.channel.guild) {
        u.db.createGuild(msg.channel.guild.id);
        guild = await u.db.getGuild(msg.channel.guild.id);
    }
    if (guild && guild.prefix) prefix = guild.prefix;
    if (!msg.content.startsWith(prefix)) return;
    let user = await u.db.getUser(msg.author.id);
    if (!user) {
        u.db.createUser(msg.author.id);
        user = await u.db.getUser(msg.author.id);
    }
    let msgSplit = msg.content.split(' ');
    let cmdName = msgSplit[0].toLowerCase().slice(prefix.length);
    if (!main.commands[cmdName]) return;
    if (main.commands[cmdName].settings.restricted && msg.author.id !== config.ownerid) return;
    let cmdArgs = msgSplit.slice(1);
    try {
        main.commands[cmdName].process(bot, msg, cmdArgs, guild, user);
    } catch (err) {
        bot.createMessage(msg.channel.id, '❌ Uh Oh, there was an error when executing this command. The bot develoepr has been notified and the issue will be sorted shortly.');
        bot.createMessage("241149423227240458", `❌ ${err}`);
    }
    if (msg.channel.guild) {
        let count = 1;
        if (guild.count) count = guild.count + 1;
        u.db.updateGuild(msg.channel.guild.id, {"count": count});
    }
    if (user) {
        let count = 1;
        if (user.count) count = user.count + 1;
        u.db.updateUser(msg.author.id, {"count": count});
    }
    console.log(`${msg.author.username} (${msg.author.id}) executed ${cmdName} in ${msg.channel.name} (${msg.channel.id}) in ${msg.channel.guild.name} (${msg.channel.guild.id})`);
});

const listUpdate = () => {
    const post = require('./events/post.js');
    post.main(bot.guilds.size);
    console.log('Posted new guild count.');
}
let listUpdateInt = setInterval(() => {
    listUpdate();
}, 1800000);
listUpdate();

bot.connect();
