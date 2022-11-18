const users = require("../controllers/test.users.controller");
const router = require("express").Router();
const verify = require("../middlewares/auth");

router.get("/:id", verify.verifyToken, users.profile);
router.get("/secure/:id", users.login);

router.post("/", users.create);

router.delete("/drop", users.drop);
router.delete("/", users.deleteAll);

module.exports = router;
