//jshint esversion:8
const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true
    },
    applicationUrl: {
        type: String,
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['opportunity', 'hackathon', 'job', 'event', 'open-source'],
        default: "opportunity"
    },
    deadline: {
        type: Date,
        default: new Date(Date.now() + 7 * 84600000 )   // 1 day = 84600000ms
    },
    status: {
        type: String,
        enum: ['pending', 'applied', 'aborted'],
        default: "pending"
    },
    notes: {
        type: String
    }
});

module.exports = mongoose.model("Opportunity", opportunitySchema);
