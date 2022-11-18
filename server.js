const app = require("./app");
const db = require("./config/test.db");

db.sequelize
  .sync()
  .then(() => {
    console.log("synced db with server.js");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.listen(8080, () => console.log("server starting on port 8080!"));
