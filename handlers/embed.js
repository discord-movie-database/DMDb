const log = require('./log.js');

const errorMessage = '❌ There was an error with the embed. Try again later.';

const embed = module.exports = {};

embed.template = (content) => {
    return {
        embed: {
            title: content.title,
            description: content.desc,
            fields: content.fields,
            color: 0xE6B91E,
            url: content.url,
            thumbnail: {
                url: content.thumbnail
            }
        },
        content: content.content || ''
    }
}

embed.edit = async (message, content) => {
    return await message.edit(embed.template(content)).catch(err => {
        message.edit(errorMessage);
    
        log.error(err);
    });
}

embed.create = async (message, content) => {
    return await message.channel.createMessage(embed.template(content)).catch(err => {
        message.channel.createMessage(errorMessage);
    
        log.error(err);
    });
}