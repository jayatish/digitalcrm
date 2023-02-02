const { log } = require('async');
const _Company = require('../db/mongo/schema').COMPANY;
const _AccountManager = require('../db/mongo/schema').ACCOUNTMANAGER;
const LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');
class apiController {

    //Start function for set-password api
    checkSlug = (req, res, next) => {
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        let obj = req.body;
        console.log(obj)
        let Password = req.body.password;
        console.log('obj ==> ', typeof (obj.slug));
        if (obj.slug === '') {
            return res.json({
                success: false,
                msg: "Slug is required"
            })
        }
        if (obj.email === '') {
            return res.json({
                success: false,
                msg: "Email is required"
            })
        }
        if (!emailRegex.test(obj.email)) {
            return res.json({
                success: false,
                msg: "Use valid email address"
            })
        }
        if (obj.password === '') {
            return res.json({
                success: false,
                msg: "Password is required"
            })
        }
        _Company.findOne({ slug: obj.slug }).exec((error, companyResult) => {
            console.log("Company result ==> ", companyResult);
            if (companyResult) {
                _AccountManager.findOne({ email: obj.email }).exec((error, accountManagerResult) => {
                    console.log("Account manager result ==> ", accountManagerResult);
                    if (accountManagerResult) {
                        if (accountManagerResult.is_active === 0) {
                            accountManagerResult.is_active = 1;
                            accountManagerResult.password = obj.password;
                            accountManagerResult.save((err, acRes) => {
                                if (acRes) {
                                    console.log("Ac=>", acRes);
                                    return res.json({
                                        success: true,
                                        msg: "Password Update Successful"
                                    })
                                } else {
                                    console.log(err);
                                    return res.json({
                                        success: false,
                                        // msg: "This profile is already activated"
                                    })
                                }
                            })
                        } else {
                            return res.json({
                                success: false,
                                msg: "This profile is already activated"
                            })
                        }
                    } else {
                        return res.json({
                            success: false,
                            msg: "This Account  is not found"
                        })
                    }

                })
            }
            else {
                console.log("error ==> ", error);
                return res.json({
                    success: false,
                    msg: "Provided Slug does not exist in Company"
                })

            }
        })
    }
    //End fuction for set-password api
    //Start with login api using account manager
    loginApi = (req, res, next) => {
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        console.log('req.body ==> ', req.body);
        let obj = req.body;
        if (obj.email === '') {
            return res.json({
                success: false,
                msg: "Please Enter email id"
            });
        }
        if (!emailRegex.test(obj.email)) {
            return res.json({
                success: false,
                msg: "Please Enter a valid email"
            });
        }
        if (obj.password === '') {
            return res.json({
                success: false,
                msg: "Please Enter password"
            });
        }
        _AccountManager.findOne({ email: obj.email }).exec((err, loginemailResult) => {
            console.log("LOGIN RESULT ======>", loginemailResult);
            if (loginemailResult) {
                if (loginemailResult.comparePassword(obj.password)) {
                    return res.json({
                        data: loginemailResult,
                        success: true,
                        msg: "Login successful!"
                    })
                } else {
                    return res.json({
                        success: false,
                        msg: "Password mismatch"
                    })
                }
                return res.json({
                    success: true,
                    msg: "This Email id is correct"
                })
            } else {
                return res.json({
                    success: false,
                    msg: "This Email id does not exist"
                })
            }
        })
    }
    //End with login api using account manager

    //Start with companydetails api using slugname
    companyDetails = (req, res, next) => {
        // console.log(`Slug from url:${req.params.slug}`)
        let obj = req.body;
        console.log("obj:", obj);
        if (obj.slug === '') {
            return res.json({
                success: false,
                msg: "Please enter a slug name"
            })
        }
        _Company.findOne({ slug: obj.slug }).exec((err, companyDetailsResult) => {
            console.log(" companyDetails RESULT ======>", companyDetailsResult);
            console.log("host is====>", req.headers.host);
            if (companyDetailsResult) {
                let image = companyDetailsResult.image
                console.log("company image====>", image);
                companyDetailsResult.image = `http://${req.headers.host}/images/${image}`;
                return res.json({
                    data: companyDetailsResult,
                    success: true,
                    msg: "Slug name matches with this company"
                })
            } else {
                return res.json({
                    success: false,
                    msg: "This Slug name  does not exist with any company"
                })
            }
        })
    }



    //End with companydetails api using slugname
}
module.exports = new apiController();

