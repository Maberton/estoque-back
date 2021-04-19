// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/db.sqlite'
    },
    migrations: {
      directory: './src/database/migrations'
    },
    useNullAsDefault: true,
  },

  staging: {
    client: 'mysql',
    connection: {
      database: 'anani',
      user:     'aplicacao',
      password: '[Lk.YU1Qx/vJjPCb'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/database/migrations'
    }
  },

  production: {
    client: 'mysql',
    connection: {
      database: 'anani',
      user:     'aplicacao',
      password: '[Lk.YU1Qx/vJjPCb'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/database/migrations'
    }
  }

};
