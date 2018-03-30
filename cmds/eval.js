const c = module.exports = {};
c.settings = {
    "restricted": true,
    "hidden": true,
    "description": "Developer only command for testing.",
    "large_description": "Developer only command for testing."
};

c.process = async (bot, msg, cmdArgs, guild, user, config, u) => {
    let argsJoin = cmdArgs.join(' ');

    try {
        let evaled = await eval(argsJoin);

        if (typeof evaled === 'object') evaled = JSON.stringify(evaled);
        
        bot.createMessage(msg.channel.id, evaled || 'No content to return.');
    } catch (err) {
        bot.createMessage(msg.channel.id, `❌ ${err}`);
    }
}