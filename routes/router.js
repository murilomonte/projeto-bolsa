const express = require('express')
const router = express.Router()

const operacaoController = require('../controllers/operacao-controller')


/* ----- funções de roteamento ----- */
router.get('/', function (req, res) {
  res.render('pages/home',
    {
      title: 'Home',
      paginaAtiva: 'home'
    }
  );
});

router.get('/nova_operacao', function (req, res) {
  res.render('pages/nova_operacao',
    {
      title: 'Nova Operação',
      paginaAtiva: 'operacao'
    }
  );
})

router.get('/operacoes', operacaoController.findAll)


router.post('/salvar_operacao', operacaoController.save)


module.exports = router