const _AccountManager = require('../models').ACCOUT_MANAGER;
const _Company = require('../models').COMPANY;
const requests = require('requests');
const nodemailer = require('nodemailer');
const uploader = require('../middlewares/fileUploader');
const mailTransporter = require('../middlewares/mailTransporter')
const uploadConfig = require('../configs/upload');
const fs = require('fs');
const { log } = require('console');

class accountManagerController {
    constructor() { }

    // Start function to render Listing page
    renderList(req, res, next) {
        _AccountManager.read({}, 'list').then(result => {
            res.render('accountManager/list', {
                accountManager: result.data,
                flash: req.flash(),
            });
        }).catch(error => {
            res.redirect('/dashboard');
        })
    }


    // End function to render Listing page

    // Start function to render the Add Page
    renderAddPage(req, res, next) {
        _Company.read({ status: 0 }, 'many').then(response => {
            res.render('accountManager/add', {
                company: response,
                flash: req.flash(),
            });
            // console.log("response ====>", response);
        }).catch(error => {
            res.redirect('/accountManager');
        })
    }
    // End function to render the Add Page



    // Start function to insert data
    insertAccountManager(req, res, next) {
        uploader.uploadFiles(
            [{ name: 'image', maxCount: 1 }],
            uploadConfig.accountManager,
            ["image/jpeg", "image/jpg", "image/png"]
        )(req, res, (err) => {
            if (err) {
                res.send('Error to upload')
            } else {
                var images = (req.files.image || [])
                    .reduce((a, b) => {
                        return b.filename ? a.concat(b.filename) : a;
                    }, []);

                let imageString = (images.length) ? images[0] : '';
                let payloadObj = req.body;
                payloadObj.image = imageString;
                payloadObj.password = 'admin#123';
                // console.log('ADDED  EMAIL RIGHT HERE ====>', payloadObj.email);
                console.log('ADDED  ALL RIGHT HERE ====>', JSON.stringify(payloadObj));

                //slug add
                _Company.read({ _id: req.body.company_id }, 'single').then(result => {
                    console.log('result SLUGGG==> ', result);
                    let slugName = result.data.slug;
                    console.log("NAME SLUGG==> ", slugName);
                    //Mail sending to the registered account manager

                    let accountName = payloadObj.accountmanager_name
                    console.log("NAME accountmanager_name ====>", accountName);

                    let mailTransporter = nodemailer.createTransport({
                        service: 'smtp',
                        auth: {
                            user: 'developer@digitalaptech.com',
                            pass: 'Mercury@54321!'
                        },
                        port: 587,
                        // secure: true,
                        host: 'smtp.office365.com',
                    });

                    let mailDetails = {
                        from: "developer@digitalaptech.com",
                        to: payloadObj.email,
                        subject: "Registration successfully",
                        // text: `SLUG Name: ${slugName}`,
                        html: `<p> Hello <b>${accountName} </b></p>
                    <p>You have successfully registered in CRM portal. Please click on the below link to generate your password.</p>
                    <a href="http://localhost:3000/create-password/${slugName}">Click Here</a>      
                    <p> Thanks and regards,</p>
                    <p>CRM</p>
                    `
                    };

                    mailTransporter.sendMail(mailDetails, function (err, data) {
                        if (err) {
                            console.log('Error Occurs', err);
                        } else {
                            console.log('Email sent successfully');
                        }
                    });

                    //End Mail sending to the registered account manager

                    _AccountManager.add(payloadObj).then(response => {
                        req.flash('success', response.msg);
                        res.redirect('/accountManager');
                    }).catch
                        (error => {
                            req.flash('error', error);
                            res.redirect('/accountManager/add');
                        })
                }).catch(error => {
                    console.log('error ==> ', error);
                    res.send('This is error page');
                })


            }
        });
    }
    // End function to insert data

    // Start function to render edit page
    renderEditPage(req, res, next) {
        Promise.all([
            _Company.read({ status: 0 }, 'many'),
            _AccountManager.read({
                _id: req.params.id
            }, 'single')
        ]).then(([company, account_manager]) => {
            res.render('accountManager/edit', {
                data: account_manager,
                company: company,
                flash: req.flash(),
            });
        }).catch(error => {
            res.redirect('/accountManager');
        });
    }
    // End function to render edit page

    // Start function to update the account manager
    updateAccountManager(req, res, next) {

        uploader.uploadFiles(
            [{ name: 'image', maxCount: 1 }],
            uploadConfig.accountManager,
            ["image/jpeg", "image/jpg", "image/png"]
        )(req, res, (err) => {
            if (err) {
                res.send('Error to upload')
            } else {
                var images = (req.files.image || [])
                    .reduce((a, b) => {
                        return b.filename ? a.concat(b.filename) : a;
                    }, []);

                let imageString = (images.length) ? images[0] : '';

                let payloadObj = req.body;
                if (imageString !== '') {
                    payloadObj.image = imageString;
                }

                _AccountManager.update(payloadObj, {
                    _id: req.params.id
                }).then(response => {
                    if (imageString != '' && req.body.exist_image != '') {
                        fs.unlinkSync(uploadConfig.accountManager + req.body.exist_image);
                    }
                    req.flash('success', response.msg);
                    res.redirect('/accountManager');
                }).catch(error => {
                    req.flash('error', error.msg);
                    res.redirect('/accountManager/edit/' + req.params.id);
                });
            }
        });
    }
    // End function to update the account manager



    // Start function to delete the client
    deleteAccountManager(req, res, next) {
        _AccountManager.read({
            _id: req.params.id
        }, 'single').then(result => {
            let imageURL = result.data.image;
            _AccountManager.delete({
                _id: req.params.id
            }, 'single').then(deleteResponse => {
                if (imageURL) {
                    fs.unlinkSync(uploadConfig.accountManager + imageURL);
                }
                req.flash('success', deleteResponse.msg);
                res.redirect('/accountManager');
            }).catch(deleteError => {
                req.flash('error', deleteError.msg);
                res.redirect('/accountManager');
            })
        }).catch(error => {
            req.flash('error', error.msg);
            res.redirect('/accountManager');
        });
    }
    // End function to delete the client
}
module.exports = new accountManagerController();