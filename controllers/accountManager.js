const _AccountManager = require('../models').ACCOUT_MANAGER;
const _Company = require('../models').COMPANY;
const requests = require('requests');

const uploader = require('../middlewares/fileUploader');
const uploadConfig = require('../configs/upload');
const fs = require('fs');

class accountManagerController {
    constructor() { }

    // Start function to render Listing page
    renderList(req, res, next) {
        _AccountManager.read({}, 'list').then(result => {
            console.log('result ==> ', result);
            res.render('accountManager/list',  {
                accountManager: result.data,
                flash: req.flash(),
            });
        }).catch(error => {
            console.log('error section ==> ', error);
           res.redirect('/dashboard');
        })
    }
    // End function to render Listing page

    // Start function to render the Add Page
    renderAddPage(req, res, next) {
        _Company.read({status: 0}, 'many').then(response => {
            console.log('response ==> ', response);
            res.render('accountManager/add', {
                company: response,
                flash: req.flash(),
            });
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
                console.log("error")
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
                _AccountManager.add(payloadObj).then(response => {
                    req.flash('success', response.msg);
                    res.redirect('/accountManager');
                }).catch(error => {
                    req.flash('error', response.msg);
                    res.redirect('/accountManager/add');
                })
            }
        });
    }
    // End function to insert data

    // Start function to render edit page
    renderEditPage(req, res, next) {
        console.log('params ==> ', req.params);
        Promise.all([
            _Company.read({status: 0}, 'many'),
            _AccountManager.read({
                _id: req.params.id
            }, 'single')
        ]).then(([company,account_manager]) => {
            console.log('account_manager ==> ', account_manager);
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
                console.log("error")
                res.send('Error to upload')
            } else {
                var images = (req.files.image || [])
                    .reduce((a, b) => {
                        return b.filename ? a.concat(b.filename) : a;
                    }, []);

                let imageString = (images.length) ? images[0] : '';

                let payloadObj = req.body;
                if(imageString !== '') {
                    payloadObj.image = imageString;
                }

                _AccountManager.update(payloadObj, {
                    _id: req.params.id
                }).then(response => {
                    if(imageString !== '' && req.body.exist_image!=='') {
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
    deleteClient(req, res, next) {
        if (!req.body.client_id || req.body.client_id === '') {
            res.message = "Parameters missing";
            next();
        } else {
            var accessTokenClause = {
                token_list: {
                    $elemMatch: {
                        access_token: req.headers.auth_token
                    }
                }
            }

            _Owner.read(accessTokenClause)
                .then(userDetails => {
                    var searchClientObj = {
                        _id: req.body.client_id
                    }

                    _Client.delete(searchClientObj, 'single')
                        .then(clientObj => {
                            var client_customized_field = {
                                client_id: req.body.client_id
                            }

                            _Client_customized_field.delete(client_customized_field, 'many')
                                .then(clientCustomizedFieldObj => {
                                    return res.json({
                                        'status': 1,
                                        'message': 'Client Deleted successfully.',
                                    })
                                })
                                .catch(clientCustomizedFieldError => {
                                    res.message = clientCustomizedFieldError.msg;
                                    next();
                                })
                        })
                        .catch(clientError => {
                            res.message = clientError.msg;
                            next();
                        })
                })
                .catch(userError => {
                    res.message = userError.msg;
                    next();
                })
        }
    }
    // End function to delete the client
}
module.exports = new accountManagerController();