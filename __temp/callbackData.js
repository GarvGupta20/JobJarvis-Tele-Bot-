/*

bot.command('inline', (ctx) => {
  ctx.telegram.sendMessage(ctx.chat.id, "Here's your inline query", {
      reply_markup: {
          inline_keyboard: [
              [{text: "button 1", callback_data: "btn1"}, {text: "button 2", callback_data: "btn2"}],
              [{text: "button 3", callback_data: "btn3"}]
          ]
      }
  })
})

bot.action('btn1', (ctx) => console.log(ctx.update.callback_query))

*/

const data /*ctx.update.callback_query*/ = {
    id: '7642769199044442767',
    from: {
      id: 1779470871,
      is_bot: false,
      first_name: 'Naman',
      last_name: 'Vyas',
      username: 'coder_rancho',
      language_code: 'en'
    },
    message: {
      message_id: 22,
      from: {
        id: 5783050167,
        is_bot: true,
        first_name: 'popo',
        username: 'pop18bot'
      },
      chat: {
        id: 1779470871,
        first_name: 'Naman',
        last_name: 'Vyas',
        username: 'coder_rancho',
        type: 'private'
      },
      date: 1668686074,
      text: "Here's your inline query",
      reply_markup: { inline_keyboard: [Array] }
    },
    chat_instance: '-6322648414632289756',
    data: 'btn1'                                          // << IMPORTANT  
  }