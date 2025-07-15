const User = require('../models/user');
const { errorToString } = require('../utils/error_string');

exports.save = function (req, res) {
    /* Criar uma nova instância da classe User com os dados recebidos do corpo da requisição */
    const user = new User(req.body)
    /* Validar e realizar as conversoes necessarias nos dados da classe */
    user.validate()
    if (user.errors.length > 0) {
        // Se houver erros, redirecionar para a pagina de cadastro e exibir os erros
        // return res.send(user.errors)
        res.render('pages/error', {
            title: "error",
            message: errorToString(user.errors),
            paginaAtiva: 'Error'
        });
    } else {
        user.create()
            .then((result) => {
                res.redirect('/user/login')
            })
            .catch((error) => {
                res.render('pages/error', {
                    title: "error",
                    message: errorToString(error),
                    paginaAtiva: 'Error'
                });
            })
    }
}

exports.login = function (req, res) {
    const user = new User(req.body)
    user.validateLogin()
    if (user.errors.length > 0) {
        // Se houver erros, redirecionar para a pagina de login e exibir os erros
        // return res.send(user.errors)
        res.render('pages/error', {
            title: "error",
            message: errorToString(user.errors),
            paginaAtiva: 'Error'
        });
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
                res.render('pages/error', {
                    title: "error",
                    message: errorToString(error),
                    paginaAtiva: 'Error'
                });
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