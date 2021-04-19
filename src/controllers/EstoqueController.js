const connection = require('../database/connection');
const idUnico = require ('../utils/idUnico');
const moment = require('moment');
module.exports = {
    async cadastrar(request, response) {
      
      const { nomeProduto, quantidade, custo, valorVendaSugerido, dataValidade, codBarras } = request.body;

      let idProduto = '';
      const dataEstoque = moment().format('DD/MM/YYYY');

      const produto = await connection('produtos')
        .where('nome', nomeProduto)
        .select('*')
        .first();

        if ( !produto ) {

          const id = idUnico();

          const bodyProduto = {
            id: id,
            nome: nomeProduto,
            statusAtivacao: true,
            codBarras: codBarras
          }

          await connection('produtos').insert(bodyProduto);
          idProduto = id;
        } else {
          idProduto = produto.id;
        }
    
        await connection('estoque').insert({
          idProduto,
          dataEstoque,
          dataValidade,
          quantidade,
          custo,
          valorVendaSugerido
        })
        .then(() => {
          return response.json({ idProduto, quantidade, custo, valorVendaSugerido })
        }
        )
        .catch(error => {
          // console.log(error)
          // if (error.code === 'SQLITE_CONSTRAINT') {
            return response.status(400).json({erro: 'Estoque deste produto já cadastrado para este dia, edite o existente', nome: nomeProduto, data: dataEstoque, error: error});
          // }
        })
    
    },
    async atualizar(request, response) {
      
      const { id, idProduto, codBarras, quantidade, custo, valorVendaSugerido, dataValidade } = request.body;
      const dataAtualizacao = moment().format('YYYY-MM-DD HH:mm:ss');

      if (codBarras) {
        await connection('produtos')
          .update({codBarras})
          .where({id: idProduto})
      }
    
      await connection('estoque').update({
        quantidade,
        custo,
        valorVendaSugerido,
        dataValidade,
        dataAtualizacao
      })
      .where({id})
      .then(() => {
        return response.json({ id, quantidade, custo, valorVendaSugerido })
      }
      )
    },

    async listar(request, response) {

      let custo = 0;
      let lucro = 0;

        const estoque = await connection('estoque')
        .join('produtos', 'produtos.id', 'estoque.idProduto')
        .select(
          'estoque.id',
          'estoque.idProduto',
          'produtos.codBarras',
          'produtos.nome',
          'estoque.dataEstoque',
          'estoque.quantidade',
          'estoque.custo',
          'estoque.dataValidade',
          'estoque.valorVendaSugerido',
          'estoque.dataCriacao',
          'estoque.dataAtualizacao',
        )
        .orderBy('estoque.dataCriacao', 'desc');
        estoque.forEach(produto => {
          // CONVERSÃO NECESSÁRIA POIS na criação da tabela, o campo é convertido em tiny int
          produto.statusAtivacao = produto.statusAtivacao === 1 ? true : false;

          const valorQuantidade = produto.custo * produto.quantidade;

          custo += valorQuantidade;

          const taxaShopee = produto.valorVendaSugerido * 0.05;
          produto.taxaShopee = taxaShopee;
          produto.lucroReais = produto.valorVendaSugerido - produto.custo - taxaShopee;
          lucro += produto.lucroReais * produto.quantidade;
          const divisor = produto.custo ? produto.custo : 1;
          produto.lucroPercentual = ((produto.valorVendaSugerido - produto.custo - taxaShopee) / divisor) * 100;
        });

        return response.json({soma: {custo: custo, lucro: lucro}, dados:estoque});
    }
}