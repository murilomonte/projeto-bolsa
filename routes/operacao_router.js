const express = require('express')
const router = express.Router()

const operacaoController = require('../controllers/operacao_controller.js')
const userController = require('../controllers/user_controller.js')

router.get('/', userController.mustBeAuthenticated, operacaoController.findAll)

router.get('/nova', userController.mustBeAuthenticated, operacaoController.getForm)

router.post('/salvar', userController.mustBeAuthenticated, operacaoController.save)


module.exports = router