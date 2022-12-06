const _User = require('../db/mongo/schema').USER;
const _Admin_Auth = require('../models').ADMIN_AUTH;

const LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');
class adminAuthController {
    // Start section to render the Login Page
    renderLogin(req, res, next) {
        console.log('Data ==> ', localStorage.getItem('userdata'));
        res.render('login');
    }
    // End section to render the Login Page
    // Start function to create Admin
    signUp(req, res, next) {
        console.log('req.body ==> ', req.body);
        let createAdmin = new _User(req.body);
        createAdmin.save((err, result) => {
            if(err) {
                return res.json({
                    status: 401,
                    message: err
                })
            } else {
                return res.json({
                    'status': 1,
                    'message': 'Successfully LoggedIn',
                    'data': result
                })
            }
        })
    }
    // End function to create Admin

    apisignin(req,res,next) {
        let createObj = {
            email: req.body.email,
            password: req.body.password
        }
        _Admin_Auth.signIn(createObj).then(result => {
            res.json(result)
        }).catch(error => {
            console.log('error data ==> ', error);
            // res.send("Database error")
            res.json(result)
        })
    }

    // Start section for Admin Sign In
    postLogin(req, res, next)  {
        console.log('req.body ==> ', req.body);
        let createObj = {
            email: req.body.username,
            password: req.body.password
        }
        _Admin_Auth.signIn(createObj).then(result => {
            if(result.status) {
                console.log('success == >', result);
                localStorage.setItem('userdata', JSON.stringify(result));
                res.send('Login Successful')
            } else {
                console.log('error == >', result);
                res.redirect("/")
            }
        }).catch(error => {
            console.log('error data ==> ', error);
            res.send("Database error")
        })
    }
    // End section for Admin Sign In
}
module.exports = new adminAuthController();