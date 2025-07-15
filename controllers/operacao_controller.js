
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
    dadosDaOperacao.user_id = res.locals.usuario.id; // Adiciona o id do user a operacao
    const operacao = new Operacao(dadosDaOperacao);
    /* Validar e realizar as conversoes necessarias nos dados da classe */
    operacao.validate()
    if (operacao.errors.length > 0) {
        // return res.send(operacao.errors)
        res.render('pages/error', {
            title: "error",
            message: errorToString(user.errors),
            paginaAtiva: 'Error'
        });
    } else {
        operacao.create()
            .then((result) => {
                res.redirect('/operacao')
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

exports.findAll = function (req, res) {
    /* Criar uma nova instância da classe Operacao com propriedade data com objeto vazio */
    const operacao = new Operacao({ user_id: res.locals.usuario.id })
    operacao.readAll()
        .then((result) => { // result é uma lista de operações
            // console.log('Lista de operações: ', result);
            res.render('pages/operacoes', {
                title: 'Operações',
                paginaAtiva: 'operacao',
                operacoes: result
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