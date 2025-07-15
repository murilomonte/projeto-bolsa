const User = require('../models/user');
const { errorToString } = require('../utils/error_string');

exports.save = function (req, res) {
    const user = new User(req.body)
    user.validate()
    if (user.errors.length > 0) {
        req.flash('errors', user.errors)
        res.redirect('/user/signup');
    } else {
        user.create()
            .then((result) => {
                res.redirect('/user/login')
            })
            .catch((error) => {
                req.flash('errors', user.errors)
                res.redirect('/user/signup');
            })
    }
}

exports.login = function (req, res) {
    const user = new User(req.body)
    user.validateLogin()
    if (user.errors.length > 0) {
        req.flash('errors', user.errors)
        res.redirect('/user/login');
    } else {
        user.login()
            .then((result) => {
                req.session.usuario = {
                    username: result.username,
                    id: result.id
                }
                req.session.save(function () {
                    res.redirect("/")
                })
            })
            .catch((error) => {
                req.flash('errors', user.errors)
                res.redirect('/user/login');
            })
    }
}

exports.logout = function (req, res) {
    req.session.destroy(function () {
        res.redirect("/")
    })
}

exports.mustBeAuthenticated = function (req, res, next) {
    if (req.session.usuario) {
        return next()
    } else {
        return res.redirect('/user/login')
    }
}