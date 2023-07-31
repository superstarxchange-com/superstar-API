const req = require("express/lib/request");
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

module.exports = db = {};
 
initialize();

async function initialize() {
  // create db if it doesn't already exist

  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASS;
  const database = process.env.DB_NAME;

  console.log(host, port, user, password, database);

  const connection = await mysql.createConnection({
    host: host,
    port: port,
    user: user,
    password: password,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

  // connect to db
  const sequelize = new Sequelize(database, user, password, {
    host: host,
    port: port,
    logging: console.log,
    maxConcurrentQueries: 100,
    dialect: "mysql",
    dialectOptions: {
      ssl: "Amazon RDS",
    },
    pool: { maxConnections: 5, maxIdleTime: 30 },
    language: "en",
  });

  // init models and add them to the exported db object
  db.User = require("../models/user.model")(sequelize);
  db.Wallet = require("../models/wallet.model")(sequelize);
  db.Transaction = require("../models/transaction.model")(sequelize);
  db.Funding = require("../models/funding.model")(sequelize);
  db.mobile_verification_status =
    require("../models/mobile_verification_status")(sequelize);
  db.tempUser = require("../models/tempUser.model")(sequelize);
  // password reset token
  db.changePassword = require("../models/change_password")(sequelize);
  // subscriber:
  db.subscribe = require("../models/subscriber")(sequelize);
  // email otp model:
  db.email_otp = require("../models/email_otp.model")(sequelize);
  db.exclusive_pay = require("../models/exclusive_pay")(sequelize);
  // sync all models with database
  await sequelize.sync();
}
