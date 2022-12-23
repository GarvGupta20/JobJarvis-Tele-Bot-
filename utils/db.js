//jshint esversion:8
const Opportunity = require("../Models/Opportunity");

const postOpportunity = async (
    {
        chatId,
        title,
        applicationUrl
    }
) => {
    try {
        const opportunity = new Opportunity({
                chatId,
                title,
                applicationUrl
        });
        let res = await opportunity.save();
        return res;

    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    postOpportunity
};
