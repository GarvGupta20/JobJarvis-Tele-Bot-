//jshint esversion:8

const hello = (ctx) => {
    let user = ctx.message.from.first_name;
    ctx.reply(`Hey ${user}, I can greet you now in english but e are coming with more languages. Just to make sure we can do what we state 🤦`);
};

const nohello= (ctx) => {
  let user=ctx.message.from.first_name;
  ctx.reply(`Bye Bye ${user}, we hope you have a great experience with our application`);
};

//export default nohello;
module.exports={nohello,hello};
