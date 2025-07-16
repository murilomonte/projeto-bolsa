
const Operacao = require('../models/operacao')

exports.getForm = function (req, res) {
    let operacao = new Operacao({});
    res.render('pages/nova_operacao',
        {
            title: 'Nova Operação',
            paginaAtiva: 'Operacao',
            ativosValidos: operacao.ATIVOS_VALIDOS,
            tiposValidos: operacao.TIPOS_VALIDOS
        }
    );
}

exports.save = function (req, res) {
    let dadosDaOperacao = req.body;
    dadosDaOperacao.user_id = res.locals.usuario.id;
    const operacao = new Operacao(dadosDaOperacao);
    operacao.validate()
    if (operacao.errors.length > 0) {
        req.flash('errors', operacao.errors)
        res.redirect('/operacao/nova/');
    } else {
        operacao.create()
            .then((result) => {
                res.redirect('/operacao')
            })
            .catch((error) => {
                console.log(error)
                req.flash('errors', operacao.errors)
                res.redirect('/operacao/nova/');
            })
    }
}

exports.findAll = function (req, res) {
    /* Criar uma nova instância da classe Operacao com propriedade data com objeto vazio */
    const operacao = new Operacao({ user_id: res.locals.usuario.id })
    operacao.readAll()
        .then((result) => { // result é uma lista de operações
            // console.log('Lista de operações: ', result);
            res.render('pages/operacoes', {
                title: 'Operações',
                operacoes: result
            })
        })
        .catch((error) => {
            req.flash('errors', operacao.errors)
            res.render('pages/error', {
                title: "Error"
            });
        })
}