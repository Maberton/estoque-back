exports.up = function(knex) {
  return knex.schema.createTable('estoque', function (tabela) {
      tabela.increments('id').primary();
      tabela.string('idProduto');
      tabela.foreign('idProduto').references('produtos.id');
      tabela.string('dataEstoque').notNullable();
      tabela.integer('quantidade').notNullable();
      tabela.decimal('custo');
      tabela.string('dataValidade');
      tabela.decimal('valorVendaSugerido');
      tabela.timestamp('dataCriacao').defaultTo(knex.fn.now());
      tabela.timestamp('dataAtualizacao').defaultTo(knex.fn.now());
      tabela.unique(['idProduto', 'dataEstoque']);
  })
}

exports.down = function(knex) {
    return knex.schema.dropTable('estoque');
}