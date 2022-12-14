const joi = require('joi')

const username = joi
  .string()
  .pattern(/^[\S]{1,20}$/)
  .required()
const password = joi
  .string()
  .pattern(/^[\S]{3,15}$/)
  .required()
const name = joi.string().pattern(/^[\S]{1,15}$/)
const user_department = joi
  .string()
  .pattern(/^[\S]{1,30}$/)
  .required()
const user_type = joi.required()

exports.userRegisterCheck = {
  body: {
    username,
    password,
    name,
    user_department,
    user_type,
  },
}

exports.userLoginCheck = {
  body: {
    username,
    password,
  },
}
