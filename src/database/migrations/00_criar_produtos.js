exports.up = function(knex) {
  return knex.schema.createTable('produtos', function (tabela) {
      tabela.string('id').primary();
      tabela.string('nome').unique().notNullable();
      tabela.string('codBarras').unique();
      tabela.string('descricao');
      tabela.string('fabricante').defaultTo(null);
      tabela.boolean('statusAtivacao').defaultTo(true);
      tabela.timestamp('dataCriacao').defaultTo(knex.fn.now());
      tabela.timestamp('dataAtualizacao').defaultTo(knex.fn.now());
  })
}

exports.down = function(knex) {
    return knex.schema.dropTable('produtos');
}