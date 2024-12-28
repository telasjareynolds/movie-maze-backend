const SUCCESSFUL_REQUEST = 200;
const SUCCESSFUL_REQUEST_MSG = "Request was successful";
const ID_BADREQUEST_MSG = "Invalid or missing ID";
const INVALID_BADREQUEST_MSG =
  "Email or password not valid. Valid input data is required.";
const NOTFOUND_ERROR_MSG = "Current user not found";
const UNAUTHORIZED_ERROR_MSG = "Incorrect email or password";
const FORBIDDEN_ERROR_MSG = "Movie not not saved by this user. Unauthorized to change this user's saved objects.";
const CONTFLICT_ERROR_MSG = "User with this email already exists";

module.exports = {
  SUCCESSFUL_REQUEST,
  SUCCESSFUL_REQUEST_MSG,
  ID_BADREQUEST_MSG,
  INVALID_BADREQUEST_MSG,
  NOTFOUND_ERROR_MSG,
  UNAUTHORIZED_ERROR_MSG,
  FORBIDDEN_ERROR_MSG, 
  CONTFLICT_ERROR_MSG
};
