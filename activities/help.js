//jshint esversion:8



const help = (ctx) => {
    let chatType = ctx.chat.type;
    let userName = ctx.message.from.first_name;
    let chatName = ctx.chat.title;

    if (chatType !== 'private') {
        ctx.getChatAdministrators().then(admins => {
            let admintrators = admins.map((adm, index) => {
                return `${index + 1}. ${adm.user.first_name} - @${adm.user.username}\n`;
            });

            ctx.replyWithHTML(
                `
                Please Contact any of these admins from more info about ${chatName} \n${admintrators.join('')}
                `
            );
        }).catch(err => {
            ctx.reply(err);
        });
        return;
    }

    ctx.replyWithHTML(`
    Hello <b>${userName}</b>. I am  and I JobJarvis I do almost everything.

    /start : starts the bot

    /help : helps with naviagtion

    /pending : dump all your pending opportunities




    `);
};

module.exports={help};
