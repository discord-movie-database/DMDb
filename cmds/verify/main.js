const u = require('../../util/main.js');

const admins = ["148899081304014848"];
const admin = {
    guild: {
        add: (msg, guild, user) => {
            if (guild.verified) return {type: '❌', message: 'Guild already verified'};
            await u.db.updateGuild({verified: true});
            return {type: '✅', message: 'Verified this guild.'};
        },
        remove: (msg, guild, user) => {
            if (guild.verified && guild.verified === false) return {type: '❌', message: 'Guild already unverified.'};
            await u.db.updateGuild({verified: false});
            return {type: '✅', message: 'Unverified this guild.'};
        }
    },
    user: {
        add: (msg, guild, user) => {
            if (user.verified) return {type: '❌', message: 'User already verified.'};
            await u.db.updateUser({verified: true});
            return {type: '✅', message: 'Verified this user.'};
        },
        remove: (msg, guild, user) => {
            if (user.verified && user.verified === false) return {type: '❌', message: 'Sser already unverified.'};
            await u.db.updateUser({verified: false});
            return {type: '✅', message: 'Unverified this user.'};
        }
    }
};

const check = (msg, cmdArgs, guild) => {
    let issues = [];
    let bots = 0;
    let members = msg.channel.guild.memberCount - bots;
    let memCount = msg.channel.guild.memberCount;
    msg.channel.guild.members.forEach(member => {
        if (member.bot) bots++;
    });
    if (guild.verified) issues.push('Server already verified.');
    if (bots > members) issues.push('Bot collection server. (More bots than members)');
    if (memCount < 130) issues.push(`Not enough members. (${memCount})`);
    if (!cmdArgs[0]) issues.push('No description explaining what the server is about.');
    return issues;
}

const c = module.exports = {};
c.settings = require('./settings.json');
c.process = async (bot, msg, cmdArgs, guild, user) => {
    let argsJoin = cmdArgs.join(' ');
    if (!msg.channel.guild) return bot.createMessage(msg.channel.id, '❌ You need to be in a server to use this command.');
    if (msg.author.id !== msg.channel.guild.ownerID || msg.author.id !== '148899081304014848') return bot.createMessage(msg.channel.id, '❌ Only the server owner can use this command.');
    if (cmdArgs[0] === 'admin' && admins.indexOf(msg.author.id) > -1) {
        if (cmdArgs[1] && admin[cmdArgs[1]] && cmdArgs[2] && admin[cmdArgs[1]][cmdArgs[2]]) {
            let process = admin[cmdArgs[1]][cmdArgs[2]](msg, guild, user);
            bot.createMessage(msg.channel.id, process.type + ' ' + process.message);
        } else {
            bot.createMessage(msg.channel.id, '❌ Invalid arguments.');
        }
        return;
    }
    let issues = check(msg, cmdArgs, guild);
    if (issues[0]) {
        let message = '';
        for (let i = 0; i < issues.length; i++) message += `\n**-** ${issues[i]}`;
        bot.createMessage(msg.channel.id, {embed: {
            title: 'Verification request',
            description: `There was the follwing issues with your request:\n${message}`,
            color: 0xE6B91E
        }});
        return;
    }
    let invite = await bot.createChannelInvite(msg.channel.id, {maxAge: 0});
    bot.createMessage(msg.channel.id, '✅ Successfully sent verification request. It will be reviewed shortly.');
    bot.createMessage("262940448035700736", {embed: {
        title: msg.channel.guild.name + ' - Verification request',
        description: argsJoin,
        fields: [{
            name: 'ID',
            value: msg.channel.guild.id,
            inline: true
        }, {
            name: 'Members',
            value: msg.channel.guild.memberCount,
            inline: true
        }, {
            name: 'Command Usage',
            value: guild.count,
            inline: true
        }, {
            name: 'invite',
            value: `http://discord.gg/${invite.code}`
        }],
        color: 0xE6B91E
    }});
}
