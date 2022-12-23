//jshint esversion:9
const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const {parseUrls} = require('./utils/parser');
const Opportunity = require('./Models/Opportunity');
const { postOpportunity } = require('./utils/db');
const {welcome} =require('./activities/welcome.js');
const {nohello,hello} =require('./activities/nohello.js');
const {help} =require('./activities/help.js');
const {GREETINGS,BYE} =require('./textArray.js');
const {applicationResponse} = require('./middleware/response.js');
const {bot_tutorial_text}=require('./bot-text.js');

require("dotenv").config();

const data_updater={
  updating:false,
  to_update:'',
  url:''
};


const bot = new Telegraf(process.env.BOT_TOKEN);

// ------------ Main --------------
const main = async () => {
    console.clear();


    try {
        console.log("Connecting to DB");
        mongoose.connect(
            //"mongodb+srv://naman:6huTq08TPDB9zwuy@cluster0.qscrv0x.mongodb.net/?retryWrites=true&w=majority",
            process.env.MONGO_URL,
            {
                dbName: "OpportunityBot"
            },
            (err) => {
                if (!err) console.log("DB connected.");
                else throw err;
            });
    } catch (err) {
        console.log("\n\nxxxxxxxxxxxxxxxxxxxxxx\n");
        console.log("Error while connecting to db");
        console.error(err);
    }

    try {
        console.log("Connecting to Bot.");
        bot.launch()
            .then( () => console.log("Bot has started!!"));
        // Enable graceful stop
        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));
    } catch (err) {
        console.log("\n\nxxxxxxxxxxxxxxxxxxxxxx\n");
        console.log("Error while connecting to the bot.");
        console.error(err);
    }

};

//bot.command('start', (ctx) => ctx.reply('Hey there!!'));

/*Default commands needed in our chatboy*/
bot.start(welcome);
bot.help(help);
/*end of utility*/


/*greeting our bot*/
bot.hears(GREETINGS, hello);
bot.hears(BYE,nohello);
bot.hears(['Post any Link'],(ctx) => {
   ctx.reply('waiting for a link');
});


/*end of utility*/




/* pending command */

bot.command('pending', async (ctx) => {

    // const s = 'cool'
    // const regex = new RegExp(s, 'i') // i for case insensitive
    // Posts.find({title: {$regex: regex}})
    const text = ctx.update.message.text;
    const query = text.length > 8 ? text.substring(9) : "";

    const pendingOpportunities = await Opportunity.find({
        title: {$regex: new RegExp(query, 'i')},
        chatId: ctx.chat.id,
        status: 'pending'
    }).exec();

    if(pendingOpportunities.length===0 || pendingOpportunities===undefined) {
      ctx.reply('No Opportunity Found For The Query');
      return;
    }

    pendingOpportunities.map(opportunity => {
        let {title, applicationUrl} = opportunity;
        if (title == applicationUrl) title = "";
        ctx.telegram.sendMessage(
            ctx.chat.id,
            `${title.length < 40 ? title : title.slice(0, 40) + "..."}
            ${applicationUrl}
            `,
            {
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {text: "Applied✅", callback_data: "applied"},
                            {text: "Abort❌", callback_data: "aborted"},
                            {text: "Infoℹ️", callback_data: "askInfo"}
                        ]
                    ]
                }
            }
        );
    });
});



//text commands*/

bot.on("text", async (ctx, next) => {


    if(data_updater.updating===true) {

      console.log(data_updater.url);


      switch(data_updater.to_update) {
          case 'title':
          Opportunity.findOneAndUpdate({applicationUrl:data_updater.url},{title:ctx.message.text},(err,data) => {
            console.log(data);
            console.log(err);
          });

          break;
       case 'type':
            Opportunity.findOneAndUpdate({applicationUrl:data_updater.url},{type:ctx.message.text},(err) => {
              console.log(err);
            });
          break;

      case 'deadline':
             Opportunity.findOneAndUpdate({applicationUrl:data_updater.url},{deadline:ctx.message.text.toLocaleString('en-us',{year:'numeric',month:'numeric',day:'numeric'})},
             (err) => {
               console.log(err);
             });
             ctx.reply(`your ${data_updater.to_update} has been updated`);
             break;
      case  'notes' :
      Opportunity.findOneAndUpdate({applicationUrl:data_updater.url},{notes:ctx.message.text},(err) => {
        console.log(err);
      });
      ctx.reply(`your ${data_updater.to_update} has been updated`);
             break;

      case 'shownotes' :
         Opportunity.findOne({applicationUrl:data_updater.url},(err,data) => {
           if(err) {console.log(err);}
           else ctx.reply(`${data.notes}`);
         });
         ctx.reply(`your ${data_updater.to_update} has been updated`);
         break;
        default:
           ctx.reply('sorry something has gone wrong');
    }



        data_updater.updating=false;
        return;
    }


    const urls = parseUrls(ctx.message.text);

    if (urls.length == 0) {
        ctx.reply("The message don't contain any application url");
        return;
    } else if (urls.length > 1) {

        if (urls.length > 4) {
            ctx.reply("Too many urls provided.");
            return;
        }

        urls.map( (url, index) => {
            ctx.telegram.sendMessage(
                ctx.chat.id,
                url,
                {
                    reply_markup: {
                        inline_keyboard: [[{text: "Select", callback_data: `btn${index+1}`}]]
                    },
                    disable_web_page_preview: true
                }
            );
        });

        // ctx.telegram.sendMessage(ctx.chat.id, "Choose the application url.", {
        //     reply_markup: {
        //         inline_keyboard: urls.map((url, index) => [
        //             {
        //                 text: url,
        //                 callback_data: url
        //             }
        //         ])
        //     }
        // })
    } else {
        let res = await postOpportunity({
            chatId: ctx.chat.id,
            title: ctx.message.text,
            applicationUrl: urls[0]
        });
        ctx.opportunity = res;
        next();
        /* Todo: bot.reply with callback */
    }
},applicationResponse);
/*end of utility*/













// ----------- Actions ------------------------------




/* end*/



// --------- LINK BUTTONS ----------
bot.action('btn1', async (ctx,next) => {
    const query = ctx.update.callback_query;
    const url = query.message.text;
    let res = await postOpportunity({
        chatId: ctx.chat.id,
        title: query.message.text,
        applicationUrl: url
    });
    ctx.opportunity=res;
    next();
},applicationResponse);

bot.action('btn2', async (ctx,next) => {
    const query = ctx.update.callback_query;
    const url = query.message.text;
    let res = await postOpportunity({
        chatId: ctx.chat.id,
        title: query.message.text,
        applicationUrl: url
    });
    ctx.opportunity=res;
    next();
},applicationResponse);

bot.action('btn3', async (ctx,next) => {
    const query = ctx.update.callback_query;
    const url = query.message.text;
    let res = await postOpportunity({
        chatId: ctx.chat.id,
        title: query.message.text,
        applicationUrl: url
    });
    ctx.opportunity=res;
    next();
},applicationResponse);

bot.action('btn4', async (ctx,next) => {
    const query = ctx.update.callback_query;
    const url = query.message.text;
    let res = await postOpportunity({
         chatId: ctx.chat.id,
         title: query.message.text,
         applicationUrl: url
     });
    ctx.opportunity=res;
    next();

},applicationResponse);


bot.action('applied', async (ctx) => {
    const query = ctx.update.callback_query;
    const url = parseUrls(query.message.text)[0];
    await Opportunity.updateOne({applicationUrl: url}, {status: "applied"});
    ctx.telegram.deleteMessage(ctx.chat.id, query.message.message_id);
});

bot.action('aborted', async (ctx) => {
    const query = ctx.update.callback_query;
    const url = parseUrls(query.message.text)[0];
    await Opportunity.updateOne({applicationUrl: url}, {status: "aborted"});
    ctx.telegram.deleteMessage(ctx.chat.id, query.message.message_id);
});

bot.action('askInfo', async (ctx, next) => {
    const query = ctx.update.callback_query;
    const url = parseUrls(query.message.text)[0];
    ctx.opportunity = await Opportunity.findOne({applicationUrl: url}).exec();
    next();
},
applicationResponse);





bot.action('teach',(ctx) => {
   ctx.reply('<b>so we are gonna start with the tutorial</b>',{parse_mode:"HTML"});
   ctx.reply('<b>About telegram Bot!!</b>',{parse_mode:"HTML"});
   ctx.reply(`${bot_tutorial_text}`,{parse_mode:"HTML"});
   ctx.reply('To know more click <a href="https://core.telegram.org/">More</a>',{parse_mode:"HTML"});
});

bot.action('proceed',(ctx) => {
  ctx.reply("<b>Start postimg opportunities...</b>",{
            reply_markup: {
              resize_keyboard: true,
              keyboard: [
                [{text:'/pending'}],
                [{text:"Post any Link"}],
                [{text:"/help"}]
              ],
            //  keyboard:[[{text:'Log In'},{text:'About'},{text:'Commands'}]],
            },
            parse_mode:"HTML",
      });
});


bot.action('Exit',async (ctx) => {
       ctx.reply('So I think thats it from your side!! We hope we were a great help');

});

bot.action('leave',async (ctx) => {
      ctx.reply('Bye');
});


bot.action(' About',(ctx) => {

});



bot.action('updateTitle',async (ctx) => {
  const query = ctx.update.callback_query;
  const urls = parseUrls(query.message.text);
  ctx.reply('please add the title');
  if (urls.length == 1) {

        data_updater.updating=true;
        data_updater.to_update='title';
        data_updater.url=urls[0];


   //  Opportunity.findOneAndUpdate({chatId:ctx.chat.id,applicationUrl:ursl[0]});
  }

  else {

    urls.map((val,index) => {
         if(Opportunity.exists({applicationUrl:val})) {
           data_updater.updating=true;
           data_updater.to_update='title';
           data_updater.url=val;
         }
    });

  }
});

bot.action('updateDeadline',async (ctx) => {
  const query = ctx.update.callback_query;
  const urls = parseUrls(query.message.text);
  ctx.reply('please add the deadline');
  if (urls.length == 1) {

        data_updater.updating=true;
        data_updater.to_update='deadline';
        data_updater.url=urls[0];


   //  Opportunity.findOneAndUpdate({chatId:ctx.chat.id,applicationUrl:ursl[0]});
  }

  else {

    urls.map((val,index) => {
         if(Opportunity.exists({applicationUrl:val})) {
           data_updater.updating=true;
           data_updater.to_update='deadline';
           data_updater.url=val;
         }
    });

  }
});

bot.action('updateType',async (ctx) => {
  const query = ctx.update.callback_query;
  const urls = parseUrls(query.message.text);
  ctx.reply('please add the Type');
  if (urls.length == 1) {

        data_updater.updating=true;
        data_updater.to_update='type';
        data_updater.url=urls[0];


   //  Opportunity.findOneAndUpdate({chatId:ctx.chat.id,applicationUrl:ursl[0]});
  }

  else {

    urls.map((val,index) => {
         if(Opportunity.exists({applicationUrl:val})) {
           data_updater.updating=true;
           data_updater.to_update='type';
           data_updater.url=val;
         }
    });

  }
});

bot.action('appendNote',async (ctx) => {
  const query = ctx.update.callback_query;
  const urls = parseUrls(query.message.text);
  ctx.reply('please add to the notes');
  if (urls.length == 1) {

        data_updater.updating=true;
        data_updater.to_update='notes';
        data_updater.url=urls[0];


   //  Opportunity.findOneAndUpdate({chatId:ctx.chat.id,applicationUrl:ursl[0]});
  }

  else {

    urls.map((val,index) => {
         if(Opportunity.exists({applicationUrl:val})) {
           data_updater.updating=true;
           data_updater.to_update='notes';
           data_updater.url=val;
         }
    });

  }
});

bot.action('showNotes',async (ctx) => {
  const query = ctx.update.callback_query;
  const urls = parseUrls(query.message.text);
  ctx.reply('We provide you notes regarding this opportunity');
  if (urls.length == 1) {

        data_updater.updating=true;
        data_updater.to_update='shownotes';
        data_updater.url=urls[0];


   //  Opportunity.findOneAndUpdate({chatId:ctx.chat.id,applicationUrl:ursl[0]});
  }

  else {

    urls.map((val,index) => {
         if(Opportunity.exists({applicationUrl:val})) {
           data_updater.updating=true;
           data_updater.to_update='shownotes';
           data_updater.url=val;
         }
    });

  }
});





main();
