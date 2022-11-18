const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.PGTEST_DB,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: "postgres",
    operatorsAliases: false,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
