const nodemailer = require('nodemailer');


module.exports.mailTransporter = nodemailer.createTransport({
    service: 'smtp',
    auth: {
        user: 'developer@digitalaptech.com',
        pass: 'Mercury@54321!'
    },
    port: 587,
    // secure: true,
    host: 'smtp.office365.com',
});

// let mailDetails = {
//     from: "developer@digitalaptech.com",
//     to: "ketauffuguvo-9093@yopmail.com",
//     subject: "Test mail",
//     text: "Node.js testing mail for nodemailer"
// };

// mailTransporter.sendMail(mailDetails, function (err, data) {
//     if (err) {
//         console.log('Error Occurs', err);
//     } else {
//         console.log('Email sent successfully');
//     }
// });


