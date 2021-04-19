const connection = require('../database/connection');
const idUnico = require ('../utils/idUnico');

module.exports = {
    async cadastrar(request, response) {

      const { nome, codBarras, statusAtivacao } = request.body;
      const id = idUnico();
  
      await connection('produtos').insert({
        id, 
        nome,
        codBarras,
        statusAtivacao
      })
      .catch(error => { console.log (error)})
      return response.json({ id, nome, codBarras, statusAtivacao });
    },

    async listar(request, response) {

        const produtos = await connection('produtos').select('*');

        // CONVERSÃO NECESSÁRIA POIS na criação da tabela, o campo é convertido em tiny int
        produtos.forEach(produto => {
          produto.statusAtivacao = produto.statusAtivacao === 1 ? true : false;
        });

        return response.json(produtos);
    },

    async obterProduto(request, response) {

      const { nome } = request.params;

      const produto = await connection('produtos')
      .where('nome', nome)
      .select('*')
      .first();

      return produto ? response.json(produto) : response.status(400).json({erro: 'Produto não encontrado'})

    },

    async excluirProduto(request, response) {

      const { nome } = request.params;

      const produto = await connection('produtos')
      .where('nome', nome)
      .select('*')
      .first();

      // TODO: AQUI VAI VIR A VERIFICAÇÃO DE ESTOQUE

      if (!produto) {
        return response.status(400).json({erro: 'Produto não encontrado'});
      }

      //  TODO: ESTUDAR SUBSTITUICAO DE DELETE POR ATIVO  = FALSE
      await connection('produtos').where('id', produto.id).delete();
      return response.status(204).send();

    }
}