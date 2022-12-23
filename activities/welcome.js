//jshint esversion:8


const welcome = (async (ctx) => {
  let chatType = ctx.chat.type;
  let userName = ctx.message.from.first_name;
  let chatName = ctx.chat.title;


  await ctx.replyWithPhoto(
    { url: 'https://i.postimg.cc/d1DSsW2c/Whats-App-Image-2022-11-18-at-2-55-30-PM.jpg' },
    {
        caption : `<b>Welcome to JobJarvis!!</b>\n\nTired of managing multiple job applications and
        their deadlines!!\nWe help you turn your hectic list of opportunities into a full fledged schedule for you that is manageable`,
        parse_mode : "HTML"
    }
  );



ctx.reply("If it's your first time using check out our tutorial and about sections<b>Proceed</b>",{
          reply_markup: {
            resize_keyboard: true,
            inline_keyboard: [
              [{text:'Tutorial',callback_data:"teach"}],
              [{text:"Proceed",callback_data:"proceed"}],
              [{text:"About",callback_data:"About"},{text:"Exit",callback_data:"Exit"}]
            ],
          //  keyboard:[[{text:'Log In'},{text:'About'},{text:'Commands'}]],
          },
          parse_mode:"HTML"
    });
  });
//export default welcome;
module.exports={welcome};




/* main values that we care about are ctx.chat and ctx.message*/
