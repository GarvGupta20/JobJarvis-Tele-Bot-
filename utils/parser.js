//jshint esversion:8
const toTextString = require("to-text-string");
const sls = require("single-line-string");
const Urls = require('my-name-is-url');

const parseUrls = (text) => {
    str = sls `${text}`;
    const result = toTextString(str);
    return Urls(result).get();
};

module.exports = {
    parseUrls
};
