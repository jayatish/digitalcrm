'use strict';

const nodemailer = require('nodemailer');
const mailConfig = require('../configs').email;
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'ssl://smtp.googlemail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'testdevloper007@gmail.com',
        pass: 'Mercury@4321!'
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
});

module.exports.sendMail = (config) => {
    let msg = {
        to: config.to,
        from: mailConfig.username+'<'+mailConfig.email+'>',
        subject: config.subject,
        text: config.text,
        html: config.html || ''
    };
    transporter.sendMail(msg, (err, info) => {
        if (!err) {
            console.log("Message delivered: ", info);
        } else {
            console.log(err);
        }
    })
}
