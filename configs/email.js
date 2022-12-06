'use strict';

const development = {
    email: "testdevloper007@gmail.com",
    username: 'Invoice App'
};

const production = {
    email: "testdevloper007@gmail.com",
    username: 'Invoice App'
}

module.exports = process.env.NODE_ENV === 'production' ? production : development;