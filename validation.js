const Joi = require("@hapi/joi");

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
  });

  return schema.validate(user);
}

function loginValidation(user) {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
  });

  return schema.validate(user);
}

function toDoValidation(todo) {
  const schema = Joi.object({
    title: Joi.string().min(1).required(),
    email: Joi.string().min(6).required().email(),
    note: Joi.string().required(),
    completed: Joi.boolean().required()
  });

  return schema.validate(todo);
}

module.exports.validateUser = validateUser;
module.exports.loginValidation = loginValidation;
module.exports.toDoValidation = toDoValidation;
