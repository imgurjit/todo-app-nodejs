const router = require("express").Router();
const verify = require("./verifyToken");
const { toDoValidation } = require("../validation");
const Todo = require("../models/Todo");
const User = require("../models/User");
var ObjectID = require("mongodb").ObjectID;

router.post("/addTodo", verify, async (req, res) => {
  const response = toDoValidation(req.body);
  if (response.error) return res.status(400).send(response.error.details);

  const todo = new Todo({
    title: req.body.title,
    email: req.body.email,
    note: req.body.note,
    completed: req.body.completed
  });

  try {
    const savedTodo = await todo
      .save()
      .then((todo) => {
        res.status(200).send({ msg: "Todo added", data: todo });
      })
      .catch((err) => {});
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/fetchTodos", verify, async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email does not exist");

  try {
    const todos = await Todo.find({ email: req.body.email });
    res.status(200).send({ msg: "Fetched todos", data: todos });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/deleteTodo", verify, async (req, res) => {
  const todo = await Todo.findOne({ _id: req.body.id });
  if (!todo) return res.status(400).send("Todo does not exist");

  try {
    const savedTodo = await todo
      .remove({ _id: req.body.id })
      .then((todo) => {
        res.status(200).send({ msg: "Todo Deleted", id: req.body.id });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/updateTodo", verify, async (req, res) => {
  const todo = await Todo.findOne({ _id: ObjectID(req.body.id) });
  if (!todo) return res.status(400).send("Todo does not exist");

  const tobeUpdateTodo = {
    title: req.body.title,
    email: req.body.email,
    note: req.body.note,
    completed: req.body.completed
  };

  try {
    const savedTodo = await todo
      .updateOne({ filter: { _id: ObjectID(todo._id) } }, { update: tobeUpdateTodo }, { new: true })
      .then((todo) => {
        res.status(200).send({ msg: "Todo Updated", todo: todo });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
