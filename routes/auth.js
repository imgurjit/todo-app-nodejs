const router = require("express").Router();
const User = require("../models/User");
const { validateUser, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const response = validateUser(req.body);
  if (response.error) return res.status(200).send({ errMsg: response.error.details[0]["message"] });

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(200).send({ errMsg: "Email already exists" });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });

  try {
    const savedUser = await user
      .save()
      .then((user) => {
        res.status(200).send({ user: user._id, msg: "User Registered" });
      })
      .catch((err) => {});
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/login", async (req, res) => {
  const response = loginValidation(req.body);
  if (response.error) return res.status(200).send({ errMsg: response.error.details[0]["message"] });

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(200).send({ errMsg: "Email does not exist" });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(200).send({ errMsg: "Invalid Password" });

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

  res.header("auth-token", token).send(token);
});

module.exports = router;
