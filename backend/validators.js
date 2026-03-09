const Joi = require('joi');

const registerSchema = Joi.object({
  phone: Joi.string().pattern(/^1[3-9]\d{9}$/).required().messages({
    'string.pattern.base': '请输入有效的手机号码'
  }),
  nickname: Joi.string().min(2).max(20).required(),
  password: Joi.string().min(6).max(20).required()
});

const loginSchema = Joi.object({
  phone: Joi.string().pattern(/^1[3-9]\d{9}$/).required(),
  password: Joi.string().required()
});

const petSchema = Joi.object({
  name: Joi.string().min(1).max(30).required(),
  type: Joi.string().min(1).max(30).required()
});

function validateRegister(data) {
  return registerSchema.validate(data, { abortEarly: false });
}

function validateLogin(data) {
  return loginSchema.validate(data, { abortEarly: false });
}

function validatePet(data) {
  return petSchema.validate(data, { abortEarly: false });
}

module.exports = {
  validateRegister,
  validateLogin,
  validatePet
};
