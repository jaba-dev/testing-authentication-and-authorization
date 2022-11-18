const config = require("../config/test.db");
const Sequelize = config.Sequelize;
const sequelize = config.sequelize;

config.users = require("./users")(sequelize, Sequelize);
module.exports = config;
