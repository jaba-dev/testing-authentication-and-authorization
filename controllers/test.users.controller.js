const db = require("../models/test.db");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = db.users;

exports.create = async (req, res) => {
  return User.create({
    username: req.body.username,
    password: req.body.password,
  })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.json({ message: err.message });
    });
};
exports.login = async (req, res) => {
  try {
    const foundUser = await User.findOne({
      where: { username: req.body.username },
    });

    if (foundUser) {
      const userStatus = await bcrypt.compare(
        req.body.password,
        foundUser.password
      );
      if (userStatus) {
        const token = jwt.sign(
          {
            user_id: foundUser.id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        res.json({ token });
      } else {
        res.status(400).json("username or password not correct");
      }
    } else {
      res.status(400).json("username or password not correct");
    }
  } catch (error) {
    console.log(error);
    res.status(404).json("another error occured");
  }
};

exports.profile = async (req, res) => {
  const id = req.params.id;

  try {
    const foundUser = await User.findOne({ where: { id: id } });
    if (foundUser) {
      jwt.verify(req.token, process.env.JWT_SECRET, (err, userData) => {
        if (err) {
          console.log(err);
          res.status(403).json({ message: "Unauthorized" });
        } else {
          res.json({ message: "success", userData });
        }
      });
    } else {
      res.status(401).json({ message: "Unauthorized user" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

exports.findAll = (req, res) => {
  return User.findAll()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  return Tutorial.update(req.body, { where: { id } })
    .then((result) => {
      res.json(result + " tutorial updated");
    })
    .catch((err) => {
      res.json({ message: err.message });
    });
};

exports.deleteAll = (req, res) => {
  return User.destroy({ where: {}, truncate: false })
    .then((nums) => {
      res.json(nums + " tutorials deleted");
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message || "Some error occurred while removing tutorial.",
      });
    });
};

exports.drop = (req, res) => {
  return User.drop()
    .then((result) => {
      res.json("table deleted");
    })
    .catch((err) => {
      res.json("an error occured while dropping table");
    });
};
