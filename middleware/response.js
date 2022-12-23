//jshint esversion:8

const applicationResponse= (ctx) => {
   const { title, applicationUrl, type, deadline, status } = ctx.opportunity;
   ctx.telegram.sendMessage(
       ctx.chat.id,
       `Saved successfully.
Title: ${title.length < 40 ? title : title.slice(0, 60) + "..."}
Url: ${applicationUrl}
Type: ${type}
Status: ${status}
Deadline: ${deadline.toLocaleString('en-us', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
})}


Edit the details:-
`,
       {
           disable_web_page_preview: true,
           reply_markup: {
               inline_keyboard: [
                   [
                       {text: "Title", callback_data: "updateTitle"},
                       {text: "Type", callback_data: "updateType"},
                       {text: "deadline", callback_data: "updateDeadline"}
                   ],
                   [
                       {text: "Add note", callback_data: "appendNote"}
                   ],
                   [{text:"Show notes",callback_data:"showNotes"}]
               ]
           }
       });
};


module.exports={applicationResponse};
