const _Owner = require('../models').OWNER;
const bcrypt = require('bcrypt');
class userController {
    constructor() { }
    // Start function to load the home page
    homePage(req, res, next) {
        res.render('home');
    }
    // End function to load the home page
    // Start function to reset password
    resetPassword(req, res, next) {
        if(req.params.id && req.params.token) {
            _Owner.read({
                reset_password_token: req.params.token
            }).then(getResponse => {
                res.render('reset_password', {
                    flash: req.flash(),
                });
            }).catch(getError => {
                req.flash('error', 'The page you are looking for was not found.');
                res.redirect('/error');
            })
            
        } else {
            req.flash('error', 'The page you are looking for was not found.');
            res.redirect('/error');
        }
        
    }
    // End function to reset password
    // Start function to update password
    updatePassword(req, res, next) {
        if(!req.params.id && !req.params.token) {
            req.flash('error', 'Unable to update.');
            res.redirect('/error');
        } else {
            var whereClause = {
                _id: req.params.id,
            }
            _Owner.read(whereClause)
                .then(userResponse => {
                    if(req.body.new_password.length<6) {
                        req.flash('error', 'Password length should be minimum 6 charecters long.');
                        res.redirect('/reset-password/'+req.params.id+'/'+req.params.token);
                    } else if(req.body.new_password!==req.body.confirm_password) {
                        req.flash('error', 'Password should be same');
                        res.redirect('/reset-password/'+req.params.id+'/'+req.params.token);
                    } else {
                        bcrypt.hash(req.body.new_password, 12, function (err, hash){
                            var updtQuery = {
                                'password': hash,
                                'reset_password_token': ''
                            };
                            var whereClause = {
                                '_id': req.params.id
                            }
                            _Owner.update(whereClause, updtQuery)
                                .then(updtResponse => {
                                    req.flash('success', 'Password successfully update');
                                    res.redirect('/success');
                                    // res.redirect('/reset-password/'+req.params.id+'/'+req.params.token);
                                })
                                .catch(updtError => {
                                    req.flash('error', updtError.msg);
                                    res.redirect('/reset-password/'+req.params.id+'/'+req.params.token);
                                })
                            
                        });
                    }
                    
                })
                .catch(userError => {
                    req.flash('error', userError.msg);
                    // res.redirect('/reset-password/'+req.params.id);
                    res.redirect('/error');
                })
        }
    }
    // End function to update password

    // Start function to show the error page
    errorPage(req, res, next) {
        res.render('error',{
            flash: req.flash(),
        });
        
    }
    // End function to show the error page

    // Start function to show the error page
    successPage(req, res, next) {
        res.render('success',{
            flash: req.flash(),
        });
        
    }
    // End function to show the error page
}
module.exports = new userController();