const _Owner = require('../models').OWNER;
const email = require('../helpers').EMAIL;
const server = require('../configs').server;
class authController {
    constructor() { }

    // Start function to create customer
    signUp(req, res, next) {
        let ownerObj = {
            'first_name': req.body.first_name,
            'last_name': req.body.last_name,
            'company_name': (req.body.company_name)?req.body.company_name:'',
            'email': req.body.email,
            'password': req.body.password,
            'device_type': req.body.device_type,
            'device_token': req.body.device_token,
            'signup_type': (req.body.signup_type)?req.body.signup_type:'',
            'social_id': ''
        }
        // if(req.body.company_name=='') {
        //     var existanceClause = {
        //         'email': req.body.email
        //     }
        // } else {
        //     var existanceClause = {
        //         $or: [
        //             {
        //                 'email': req.body.email
        //             }, {
        //                 'company_name': req.body.company_name
        //             }
        //         ]
        //     }
        // }

        _Owner.check_existance({
            'email': req.body.email
        }, {}, 'add').then(response => {
            _Owner.check_existance({
                'company_name': req.body.company_name
            }, {}, 'add').then(response => {
                _Owner.create(ownerObj).then(response => {
                    var signUpTimestamp = parseInt(new Date().getTime() / 1000);
                    var signUpBuffTimeStamp = new Buffer(signUpTimestamp.toString());
                    var signUpBase64dataTimeStamp = signUpBuffTimeStamp.toString('base64');

                    var signUpAccessTokenListArr = response._id.toString() + signUpBase64dataTimeStamp;
                    var signUpTokenListArr = [{
                        'device_type': req.body.device_type,
                        'device_token': req.body.device_token,
                        'access_token': signUpAccessTokenListArr
                    }];

                    var updtQuery = {
                        'token_list': signUpTokenListArr
                    };
                    var whereClaues = {
                        _id: response._id
                    };

                    _Owner.update(whereClaues, updtQuery).then((updtResponse) => {
                        let ownerSuccessData = {
                            'user_id': response._id,
                            'email': response.email,
                            'first_name': response.first_name,
                            'last_name': response.last_name,
                            'device_token': (response.device_token) ? response.device_token : '',
                            'company_url': '',
                            'access_token': signUpAccessTokenListArr,
                            'company_name': (response.company_name) ? response.company_name : '',
                            'signup_type': (response.signup_type) ? response.signup_type : '',
                            'social_id': (response.social_id) ? response.social_id : ''
                        }
                        return res.json({
                            'status': 1,
                            'message': 'Successfully Sign Up',
                            'data': ownerSuccessData
                        })
                    })
                    .catch((updtCatch) => {
                        res.message = updtCatch.msg;
                        next();
                    });
                })
                .catch(error => {
                    res.message = error.msg;
                    next();
                });
            })
            .catch(error => {
                var errMsg = error.msg;
                if(error.msg == 'Data already exists') {
                    errMsg = 'Company name already exists'
                }
                res.message = errMsg;
                next();
            });
        })
        .catch(error => {
            var errMsg = error.msg;
            if (error.msg == 'Data already exists') {
                errMsg = 'Email already exists'
            }
            res.message = errMsg;
            next();
        });
    }
    // End function to create customer

    // Start function to logged in customer
    signIn(req, res, next) {
        if(!req.body.email || req.body.email==='' || !req.body.password || req.body.password==='') {
            res.message = 'Parameters missing';
            next();

        } else {
            _Owner.read({
                'email': req.body.email,
                'social_id': ''
            }).then(response => {
                if(response.comparePassword(req.body.password)) {
                    let timestamp = parseInt(new Date().getTime() / 1000);
                    let buffTimeStamp = new Buffer(timestamp.toString());
                    let base64dataTimeStamp = buffTimeStamp.toString('base64');
                    let generateAccessTokenList = response._id.toString()+base64dataTimeStamp;

                    var generateString = Math.random().toString(36).slice(2);
                    var generateToken = response._id.toString()+Buffer.from(generateString).toString('base64');

                    var whereClaues = {
                        _id: response._id
                    }
                    var token_list_arr = response.token_list;
                    token_list_arr.push({
                        'device_type': req.body.device_type,
                        'device_token': req.body.device_token,
                        'access_token': generateAccessTokenList
                    })
                    var queryString = {
                        // 'access_token': generateToken,
                        'device_type': req.body.device_type,
                        'device_token': req.body.device_token,
                        'signup_type': (req.body.signup_type)?req.body.signup_type:'',
                        'social_id': '',
                        'token_list': token_list_arr
                    }
                    _Owner.update(whereClaues, queryString)
                        .then(updtResponse => {
                            var profileObj = {
                                'user_id': response._id,
                                'email': response.email,
                                'first_name': response.first_name,
                                'last_name': response.last_name,
                                'device_token': req.body.device_token,
                                'company_url': (response.company_logo)?server.baseUrl+'/images/'+response.company_logo:'',
                                'access_token': generateAccessTokenList,
                                'company_name': (response.company_name)?response.company_name:'',
                                'signup_type': (req.body.signup_type)?req.body.signup_type:'',
                                'social_id': (req.body.social_id)?req.body.social_id:''
                            }
                            return res.json({
                                'status': 1,
                                'message': 'Successfully LoggedIn',
                                'data': profileObj
                            })
                        });
                } else {
                    res.message = 'Invalid credentials';
                    next();
                }
            }).catch(error => {
                res.message = error.msg;
                next();
            })
        }
    }
    // End function to logged in customer

    // Start section for social SignIn
    socialSignIn(req, res, next) {
        if(!req.body.social_id || req.body.social_id == '') {
            res.message = "Parameters missing";
            next();
        } else {
            var whereClause = {
                social_list: {
                    $elemMatch: {
                        signup_type: req.body.signup_type,
                        social_id: req.body.social_id
                    }
                }
            };
            _Owner.read(whereClause)
                .then(userData => {
                    var signUpTimestamp = parseInt(new Date().getTime() / 1000);
                    var signUpBuffTimeStamp = new Buffer(signUpTimestamp.toString());
                    var signUpBase64dataTimeStamp = signUpBuffTimeStamp.toString('base64');

                    var signUpAccessTokenListArr = userData._id.toString()+signUpBase64dataTimeStamp;
                    var userDataTokenArray = userData.token_list;

                    userDataTokenArray.push({
                        'device_type': req.body.device_type,
                        'device_token': req.body.device_token,
                        'access_token': signUpAccessTokenListArr
                    });

                    var updtQuery = {
                        'token_list': userDataTokenArray
                    };

                    var company_url = '';
                    var google_logo = '';
                    var facebook_logo = '';
                    if (req.body.signup_type == 'Google') {
                        google_logo = (userData.google_logo != '') ? userData.google_logo : req.body.social_logo;
                        if (google_logo != '' && userData.google_logo == '') {
                            updtQuery['google_logo'] = company_url = google_logo;
                        }
                        else {
                            company_url = google_logo;
                        }
                    }
                    else if (req.body.signup_type == 'Facebook') {
                        facebook_logo = (userData.facebook_logo != '') ? userData.facebook_logo : req.body.social_logo;
                        if (facebook_logo != '' && userData.facebook_logo == '') {
                            updtQuery['facebook_logo'] = company_url = facebook_logo;
                        }
                        else {
                            company_url = facebook_logo;
                        }
                    }
                    else if (req.body.signup_type == 'Apple') {
                        company_url = server.baseUrl + '/images/' + userData.company_logo;
                    }

                    var whereClaues = {
                        _id: userData._id
                    };
                    _Owner.update(whereClaues, updtQuery)
                        .then(updtResponse => {
                            var returndata = {
                                'user_id': userData._id,
                                'email': userData.email,
                                'first_name': userData.first_name,
                                'last_name': userData.last_name,
                                'device_token': (req.body.device_token)?req.body.device_token:'',
                                'company_url': company_url,
                                'access_token': signUpAccessTokenListArr,
                                'company_name': (userData.company_name)?userData.company_name:'',
                                'signup_type': (req.body.signup_type)?req.body.signup_type:'',
                                'social_id': (req.body.social_id)?req.body.social_id:''
                            }
                            return res.json({
                                'status': 1,
                                'message': 'Successfully Sign In',
                                'data': returndata
                            })
                        })
                        .catch(updtError => {
                            res.message = updtError.msg;
                            next();
                        })
                })
                .catch(userError => {
                    if(userError.msg == 'User does not exist.') {
                        var emailCheckClause = {
                            email: req.body.email
                        };
                        _Owner.read(emailCheckClause)
                            .then(emailUser => {
                                var signUpTimestamp = parseInt(new Date().getTime() / 1000);
                                var signUpBuffTimeStamp = new Buffer(signUpTimestamp.toString());
                                var signUpBase64dataTimeStamp = signUpBuffTimeStamp.toString('base64');

                                var signUpAccessTokenListArr = emailUser._id.toString()+signUpBase64dataTimeStamp;
                                var userDataTokenArray = emailUser.token_list;

                                userDataTokenArray.push({
                                    'device_type': req.body.device_type,
                                    'device_token': req.body.device_token,
                                    'access_token': signUpAccessTokenListArr
                                });

                                var userSocialListArr = emailUser.social_list;
                                userSocialListArr.push({
                                    'signup_type': req.body.signup_type,
                                    'social_id': req.body.social_id
                                });

                                var updtQuery = {
                                    'token_list': userDataTokenArray,
                                    'social_id': userSocialListArr
                                };

                                var company_url = '';
                                var google_logo = '';
                                var facebook_logo = '';
                                if (req.body.signup_type == 'Google') {
                                    google_logo = req.body.social_logo ? req.body.social_logo : '';
                                    if (google_logo != '') {
                                        updtQuery['google_logo'] = company_url = google_logo;
                                    }
                                }
                                else if (req.body.signup_type == 'Facebook') {
                                    facebook_logo = req.body.social_logo ? req.body.social_logo : '';
                                    if (facebook_logo != '') {
                                        updtQuery['facebook_logo'] = company_url = facebook_logo;
                                    }
                                }
                                else if (req.body.signup_type == 'Apple') {
                                    company_url = server.baseUrl + '/images/' + emailUser.company_logo;
                                }

                                var whereClaues = {
                                    _id: emailUser._id
                                }

                                _Owner.update(whereClaues, updtQuery)
                                    .then(emailUpdtSuccess => {
                                        var returndata = {
                                            'user_id': emailUser._id,
                                            'email': emailUser.email,
                                            'first_name': emailUser.first_name,
                                            'last_name': emailUser.last_name,
                                            'device_token': (req.body.device_token)?req.body.device_token:'',
                                            'company_url': company_url,
                                            'access_token': signUpAccessTokenListArr,
                                            'company_name': (emailUser.company_name)?emailUser.company_name:'',
                                            'signup_type': (req.body.signup_type)?req.body.signup_type:'',
                                            'social_id': (req.body.social_id)?req.body.social_id:''
                                        }
                                        return res.json({
                                            'status': 1,
                                            'message': 'Successfully Sign In',
                                            'data': returndata
                                        })
                                    })
                                    .catch(emailUpdtError => {
                                        res.message = updtError.msg;
                                        next();
                                    })
                            })
                            .catch(emailError => {
                                if (emailError.msg == 'User does not exist.') {
                                    var google_logo = '';
                                    var facebook_logo = '';
                                    if (req.body.signup_type == 'Google') {
                                        google_logo = req.body.social_logo ? req.body.social_logo : '';
                                    }
                                    else if(req.body.signup_type == 'Facebook') {
                                        facebook_logo = req.body.social_logo ? req.body.social_logo : '';
                                    }

                                    var createObj = {
                                        'first_name': req.body.first_name,
                                        'last_name': req.body.last_name,
                                        'company_name': '',
                                        'company_logo': '',
                                        'google_logo': google_logo,
                                        'facebook_logo': facebook_logo,
                                        'email': req.body.email,
                                        'social_list': [{
                                            'signup_type': req.body.signup_type,
                                            'social_id': req.body.social_id
                                        }]
                                    }
                                    _Owner.create(createObj)
                                        .then(createUserSuccess => {
                                            var signUpTimestamp = parseInt(new Date().getTime() / 1000);
                                            var signUpBuffTimeStamp = new Buffer(signUpTimestamp.toString());
                                            var signUpBase64dataTimeStamp = signUpBuffTimeStamp.toString('base64');

                                            var signUpAccessTokenListArr = createUserSuccess._id.toString()+signUpBase64dataTimeStamp;
                                            var userDataTokenArray = createUserSuccess.token_list;

                                            userDataTokenArray.push({
                                                'device_type': req.body.device_type,
                                                'device_token': req.body.device_token,
                                                'access_token': signUpAccessTokenListArr
                                            });

                                            var updtQuery = {
                                                'token_list': userDataTokenArray
                                            };

                                            var whereClaues = {
                                                _id: createUserSuccess._id
                                            };
                                            _Owner.update(whereClaues, updtQuery)
                                                .then(updtNewUserSuccess => {
                                                    var company_url = '';
                                                    if (req.body.signup_type == 'Google') {
                                                        company_url = createUserSuccess.google_logo;
                                                    }
                                                    else if (req.body.signup_type == 'Facebook') {
                                                        company_url = createUserSuccess.facebook_logo;
                                                    }
                                                    var returndata = {
                                                        'user_id': createUserSuccess._id,
                                                        'email': createUserSuccess.email,
                                                        'first_name': createUserSuccess.first_name,
                                                        'last_name': createUserSuccess.last_name,
                                                        'device_token': (req.body.device_token)?req.body.device_token:'',
                                                        'company_url': company_url,
                                                        'access_token': signUpAccessTokenListArr,
                                                        'company_name': (createUserSuccess.company_name)?createUserSuccess.company_name:'',
                                                        'signup_type': (req.body.signup_type)?req.body.signup_type:'',
                                                        'social_id': (req.body.social_id)?req.body.social_id:''
                                                    }
                                                    return res.json({
                                                        'status': 1,
                                                        'message': 'Successfully Sign Up',
                                                        'data': returndata
                                                    })
                                                })
                                                .catch(updtNewUserError => {
                                                    res.message = updtNewUserError.msg;
                                                    next();
                                                })
                                        })
                                        .catch(createUserError => {
                                            res.message = createUserError.msg;
                                            next();
                                        })
                                }
                            })
                    }
                })
        }
    }
    // End section for social SignIn

    // Start function for Forgot Password
    forgotPassword(req, res, next) {
        if(!req.body.email || req.body.email === '') {
            res.message = 'Parameters missing';
            next();
        } else {
            _Owner.read({
                'email': req.body.email,
            }).then(response => {
                if (response.password != '') {
                    let buff = new Buffer(response._id.toString());
                    let base64data = buff.toString('base64');
                    var updtQuery = {
                        reset_password_token: base64data
                    };
                    var whereClause = {
                        _id: response._id
                    };
                    _Owner.update(whereClause, updtQuery)
                        .then(updtResponse => {
                            let resetpasswordLink = server.baseUrl + '/reset-password/' + response._id + '/' + base64data;
                            const forgotPasswordSubject = '<p>Hello ' + response.first_name + ' ' + response.last_name + '</p><p>Please click on the below link to reset your password</p><p><a href=' + resetpasswordLink + '>' + resetpasswordLink + '</a></p><p>Thanks and regards<br/>' + server.appName + '</p>';
                            const msg = {
                                to: response.email,
                                subject: 'Reset Password',
                                html: forgotPasswordSubject
                            };

                            email.sendMail(msg);
                            return res.json({
                                'status': 1,
                                'message': 'Reset link sent to your email id.'
                            })
                        })
                        .catch(updtError => {
                            res.message = updtError.msg;
                            next();
                        });
                }
                else {
                    if (response.social_list.length > 1) {
                        return res.json({
                            'status': 1,
                            'message': 'You are logged in with your social account, try login with that.'
                        });
                    }
                    else {
                        return res.json({
                            'status': 1,
                            'message': 'You are logged in with your social ' + response.social_list[0].signup_type + ' account, try login with that.'
                        });
                    }
                }
            }).catch(error => {
                res.message = error.msg;
                next();
            });
        }
    }
    // End function for Forgot Password
}
module.exports = new authController();