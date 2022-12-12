const _AccountManager = require('../models').ACCOUT_MANAGER;
const _Company = require('../models').COMPANY;
const async = require("async");
const requests = require('requests');
const axios = require('axios')

class accountManagerController {
    constructor() { }

    // Start function to render Listing page
    renderList(req, res, next) {

        // _Company.read({}, 'list').then(result => {
        //     console.log('result ==> ', result);
        //     res.render('company/list',  {
        //         company: result.data,
        //         flash: req.flash()
        //     });
        // }).catch(error => {
        //     console.log('error section ==> ', error);
        //     res.redirect('/dashboard');
        // })


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
        requests('https://countriesnow.space/api/v0.1/countries/currency', { streaming: true })
            .on('data', function (chunk) {
                let dataJson = JSON.parse(chunk);
                dataJson.data.sort(function (a, b) {
                    if (a.name < b.name) {
                      return -1;
                    }
                    if (a.name > b.name) {
                      return 1;
                    }
                    return 0;
                })
                res.render('accountManager/add', {
                    country: dataJson.data,
                    flash: req.flash(),
                });
            })
            .on('error', function(error) {
                console.log('error ==> ', error);
            })
    }
    // End function to render the Add Page

    // Start function to insert data
    insertAccountManager(req, res, next) {
        // console.log('req.body ==> ', req.body);
        // res.send("Insert data");
        // res.send("Insert company details");
        _AccountManager.add(req.body).then(response => {
            console.log('response ==> ', response);
            // res.send('Hello data');
            req.flash('success', response.msg);
            res.redirect('/accountManager');
        }).catch(error => {
            console.log('error ==> ', error);
            // res.send('Hello world');
            req.flash('error', response.msg);
            res.redirect('/accountManager/add');
        })
    }
    // End function to insert data

    // Start function to render edit page
    renderEditPage(req, res, next) {
        console.log('params ==> ', req.params);
        requests('https://countriesnow.space/api/v0.1/countries/currency', { streaming: true })
            .on('data', function (chunk) {
                let dataJson = JSON.parse(chunk);
                dataJson.data.sort(function (a, b) {
                    if (a.name < b.name) {
                      return -1;
                    }
                    if (a.name > b.name) {
                      return 1;
                    }
                    return 0;
                });
                _AccountManager.read({
                    _id: req.params.id
                }, 'single').then(result => {
                    console.log('result ==> ', result);
                    res.render('accountManager/edit', {
                        data: result,
                        country: dataJson.data,
                        flash: req.flash(),
                    });
                    
                }).catch(error => {
                    console.log('error ==> ', error);
                    res.send('This is error page');
                })
            })
            .on('error', function(error) {
                console.log('error ==> ', error);
            });
        
        
        
    }
    // End function to render edit page

    // Start function to update the company
    updateAccountManager(req, res, next) {
        console.log('req.body ==> ', req.body);
        _AccountManager.update(req.body, {
            _id: req.params.id
        }).then(response => {
            console.log('response ==> ', response);
            // res.send('Hello data');
            req.flash('success', response.msg);
            res.redirect('/accountManager');
        }).catch(error => {
            console.log('error ==> ', error);
            // res.send('Hello world');
            req.flash('error', response.msg);
            res.redirect('/accountManager/add');
        })
    }
    // End function to update the company

    // Start function to get the client list
    clientList(req, res, next) {
        if(!req.body.page_number || req.body.page_number==='' || !req.body.page_count || req.body.page_count==='') {
            res.message = "Parameters missing";
            next()
        } else {
            var ownerWhereClause = {
                token_list: {
                    $elemMatch: {
                        access_token: req.headers.auth_token
                    }
                }
            };
            _Owner.read(ownerWhereClause)
                .then(ownerResponse => {
                    var clientWhereClause = {
                        owner_id: ownerResponse._id
                    }
                    _Client.read(clientWhereClause, 'many')
                        .then(allClientResponse => {
                            var totalCount = allClientResponse.length;
                            var pageNumber = Math.ceil(totalCount/req.body.page_count);
                            var skip = (req.body.page_number*req.body.page_count)-req.body.page_count;
                            var clientListWhereClause = {
                                owner_id: ownerResponse._id,
                                skip: skip,
                                limit: req.body.page_count
                            }

                            _Client.read(clientListWhereClause, 'list')
                                .then(clientListResponse => {
                                    var dataObj = [];
                                    if(clientListResponse.length) {
                                        clientListResponse.map((clientData) => {
                                            var clientName = [];
                                            if(clientData.first_name!=='') {
                                                clientName.push(clientData.first_name)
                                            } if(clientData.last_name!=='') {
                                                clientName.push(clientData.last_name)
                                            }
                                            dataObj.push({
                                                client_name: clientName.join(' '),
                                                client_id: clientData._id,
                                                accountManager_name: (clientData.accountManager_name)?clientData.accountManager_name:''
                                            })
                                        })
                                    }

                                    return res.json({
                                        'status': 1,
                                        'message': 'Client List',
                                        'data': {
                                            'total_count': totalCount,
                                            'page_number': pageNumber,
                                            'client_data': dataObj
                                        }
                                    })
                                })
                                .catch(clientListError => {
                                    res.message = clientListError.msg;
                                    next()
                                })

                        })
                        .catch(allClientError => {
                            res.message = allClientError.msg;
                            next();
                        })
                })
                .catch(ownerError => {
                    res.message = ownerError.msg;
                    next();
                })
        }
    }
    // End function to get the client list

    // Start function to add client
    addClient(req, res, next) {
        if(!req.body.email || req.body.email==='') {
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
                .then(getResponse => {
                    var createObj = {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        accountManager_name: req.body.accountManager_name,
                        email: req.body.email,
                        phone: req.body.phone,
                        website: req.body.website,
                        address: req.body.address,
                        city: req.body.city,
                        state: req.body.state,
                        zip: req.body.zip,
                        owner_id: getResponse._id
                    }

                    _Client.create(createObj)
                        .then(saveResponse => {
                            var customizedFields = [];
                            if (req.body.customized_fields && req.body.customized_fields.length) {
                                req.body.customized_fields.map((singleField) => {
                                    customizedFields.push({
                                        client_id: saveResponse._id,
                                        field_name: singleField.field_name,
                                        value: singleField.value,
                                    })
                                })

                                _Client_customized_field.create(customizedFields, 'many')
                                    .then(successResponse => {
                                        return res.json({
                                            "status": 1,
                                            "message": "Client Added successfully."
                                        })
                                    })
                                    .catch(errorResponse => {
                                        res.message = errorResponse.msg;
                                        next();
                                    })
                            } else {
                                return res.json({
                                    "status": 1,
                                    "message": "Client Added successfully."
                                })
                            }
                        });
                })
                .catch(error => {
                    res.message = error.msg;
                    next();
                });
        }
    }
    // End function to add client

    // Start function to get the client details
    clientDetail(req, res, next) {
        if(!req.body.client_id || req.body.client_id==='') {
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
                    };
                    _Client.read(searchClientObj, 'single')
                        .then(clientObj => {
                            var clientData = {
                                accountmanager_name: clientObj.accountmanager_name,
                                first_name: clientObj.first_name,
                                last_name: clientObj.last_name,
                                address: clientObj.address,
                                city: clientObj.city,
                                state: clientObj.state,
                                zip: clientObj.zip,
                                contact_details: []
                            };
                            var otherDetails = [];
                            if(clientObj.first_name!=='' || clientObj.last_name!=='') {
                                var nameArray = [];
                                if(clientObj.first_name!=='') {
                                    nameArray.push(clientObj.first_name);
                                } if(clientObj.last_name!=='') {
                                    nameArray.push(clientObj.last_name);
                                }
                                otherDetails.push({
                                    'field_name': 'Sales Representative',
                                    'value': nameArray.join(' ')
                                })
                            } if(clientObj.email!=='') {
                                otherDetails.push({
                                    'field_name': 'Email',
                                    'value': clientObj.email
                                })
                            } if(clientObj.phone!=='') {
                                otherDetails.push({
                                    'field_name': 'Phone',
                                    'value': clientObj.phone
                                })
                            } if(clientObj.website!=='') {
                                otherDetails.push({
                                    'field_name': 'Website',
                                    'value': clientObj.website
                                })
                            } if(clientObj.address!=='' || clientObj.city!=='' || clientObj.state!=='' || clientObj.zip!=='') {
                                var addressArray = [];
                                if(clientObj.address!=='') {
                                    addressArray.push(clientObj.address);
                                } if(clientObj.city!=='') {
                                    addressArray.push(clientObj.city);
                                } if(clientObj.state!=='') {
                                    addressArray.push(clientObj.state);
                                }if(clientObj.zip!=='') {
                                    addressArray.push(clientObj.zip);
                                }
                                otherDetails.push({
                                    'field_name': 'Address',
                                    'value': addressArray.join(', ')
                                })
                            }
                            var client_customized_field = {
                                client_id: clientObj._id
                            }
                            clientData.contact_details = otherDetails;
                            _Client_customized_field.read(client_customized_field, 'many')
                                .then(clientCustomizedFieldObj => {
                                    if(clientCustomizedFieldObj.length) {
                                        clientCustomizedFieldObj.map(clientCustomizedValue => {
                                            clientData.contact_details.push({
                                                'field_name': clientCustomizedValue.field_name,
                                                'value': clientCustomizedValue.value
                                            })
                                        })
                                    }
                                    return res.json({
                                        'status': 1,
                                        'message': 'Client Details',
                                        'data': clientData
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
    // End function to get the client details

    // Start function to edit the client
    editClient(req, res, next) {
        if (!req.body.email || req.body.email === '') {
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
                .then(getResponse => {
                    var searchClientObj = {
                        _id: req.body.client_id
                    }

                    var createObj = {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        accountManager_name: req.body.accountManager_name,
                        email: req.body.email,
                        phone: req.body.phone,
                        website: req.body.website,
                        address: req.body.address,
                        city: req.body.city,
                        state: req.body.state,
                        zip: req.body.zip,
                    }

                    _Client.update(searchClientObj, createObj)
                        .then(saveResponse => {
                            var customizedFields = [];
                            if (req.body.customized_fields && req.body.customized_fields.length) {
                                req.body.customized_fields.map((singleField) => {
                                    customizedFields.push({
                                        client_id: req.body.client_id,
                                        field_name: singleField.field_name,
                                        value: singleField.value,
                                    })
                                })

                                var client_customized_field = {
                                    client_id: req.body.client_id
                                }

                                if (customizedFields.length) {
                                    _Client_customized_field.delete(client_customized_field, 'many')
                                        .then(clientCustomizedFieldObj => {
                                            _Client_customized_field.create(customizedFields, 'many')
                                                .then(successResponse => {
                                                    return res.json({
                                                        "status": 1,
                                                        "message": "Client Updated successfully."
                                                    })
                                                })
                                                .catch(errorResponse => {
                                                    res.message = errorResponse.msg;
                                                    next();
                                                })
                                        })
                                        .catch(clientCustomizedFieldError => {
                                            res.message = clientCustomizedFieldError.msg;
                                            next();
                                        })
                                } else {
                                    return res.json({
                                        "status": 1,
                                        "message": "Client Updated successfully."
                                    })
                                }
                            } else {
                                return res.json({
                                    "status": 1,
                                    "message": "Client Updated successfully."
                                })
                            }
                        });
                })
                .catch(error => {
                    res.message = error.msg;
                    next();
                });
        }
    }
    // End function to edit the client

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