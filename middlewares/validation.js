const { Joi, celebrate } = require("celebrate");

const validateUserCreation = celebrate({
  body: Joi.object().keys({
    username: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    email: Joi.string().required().email().messages({
      "string.email":
        "Please enter a valid email address (e.g., user@example.com).",
      "string.empty": "Email is required.",
    }),
    password: Joi.string().required().min(8).messages({
      "string.min": 'The minimum length of the "password" field is 2',
      "string.max": 'The maximum length of the "password" field is 30',
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

const validateLoginAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email":
        "Please enter a valid email address (e.g., user@example.com).",
      "string.empty": "Email is required.",
    }),
    password: Joi.string().required().min(8).messages({
      "string.min": 'The minimum length of the "password" field is 2',
      "string.max": 'The maximum length of the "password" field is 30',
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().length(24).hex().messages({
      "string.length": "The ID must be exactly 24 characters long",
      "string.hex": "The ID must be a valid hexadecimal value",
    }),
  }),
});

module.exports = {
  validateUserCreation,
  validateLoginAuth,
  validateId,
};
