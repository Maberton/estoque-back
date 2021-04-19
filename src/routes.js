const express = require('express');
const produtoController = require('./controllers/ProdutoController');
const estoqueController = require('./controllers/EstoqueController');
const { celebrate, Segments, Joi } = require('celebrate');

const routes = express.Router();

routes.get('/produtos', produtoController.listar);
routes.get('/produtos/:id', produtoController.obterProduto);
routes.delete('/produtos/:id', produtoController.excluirProduto);
routes.post('/produtos', 
celebrate({
  [Segments.BODY]: Joi.object().keys({
    nome: Joi.string().required(),
    codBarras: Joi.string(),
    statusAtivacao: Joi.boolean().required()
  })
})
, produtoController.cadastrar);

routes.get('/estoque', estoqueController.listar);
routes.post('/estoque', 
celebrate({
  [Segments.BODY]: Joi.object().keys({
    nomeProduto: Joi.string().required(),
    codBarras: Joi.string().optional(),
    dataValidade: Joi.string().optional(),
    quantidade: Joi.number().required(),
    custo: Joi.number().optional(),
    valorVendaSugerido: Joi.number().optional()
  })
})
, estoqueController.cadastrar);
routes.put('/estoque', 
celebrate({
  [Segments.BODY]: Joi.object().keys({
    id: Joi.number().required(),
    idProduto: Joi.string(),
    codBarras: Joi.string(),
    dataValidade: Joi.string(),
    quantidade: Joi.number(),
    custo: Joi.number(),
    valorVendaSugerido: Joi.number()
  })
})
, estoqueController.atualizar);

module.exports = routes;