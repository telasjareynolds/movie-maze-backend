const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

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
      "string.min": 'The minimum length of the "password" field is 8',
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
    imdbID: Joi.string().required().messages({
      "string.empty": 'The "imdbID" field must be filled in',
    }),
  }),
});

// Validate movie data
const validateMovieData = celebrate({
  body: Joi.object().keys({
    imdbID: Joi.string().required().messages({
      "string.empty": 'The "imdbID" field must be filled in',
    }),
    title: Joi.string().required().min(2).messages({
      "string.min": 'The minimum length of the "title" field is 2',
      "string.empty": 'The "name" field must be filled in',
    }),
    poster: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "poster" field must be filled in',
      "string.uri": 'the "poster" field must be a valid url',
    }),
    year: Joi.string().required().messages({
      "string.empty": 'The "year" field must be filled in',
      "string.min": 'The minimum length of the "title" field is 2',
    }),
  }),
});

module.exports = {
  validateUserCreation,
  validateLoginAuth,
  validateId,
  validateMovieData,
};
