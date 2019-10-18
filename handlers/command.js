import HandlerStructure from '../structures/handler';

class CommandHandler extends HandlerStructure {
    constructor(client) {
        super(client, 'commands');

        // this.loadFiles();
    }

    onMessageEvent(event) {
        if (event.author.bot) return;

        console.log(event.author.id);
    }
}

export default CommandHandler;
