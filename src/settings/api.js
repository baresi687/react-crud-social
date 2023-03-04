const API_BASE_URL = 'https://nf-api.onrender.com/api/v1/social';
const USER_SIGNUP_URL = API_BASE_URL + '/auth/register';
const USER_LOGIN_URL = API_BASE_URL + '/auth/login';
const GET_POSTS_URL = API_BASE_URL + '/posts?_author=true';
const CREATE_POST_URL = API_BASE_URL + '/posts';
const GET_USER_POSTS_URL = API_BASE_URL + `/profiles/`;
const EDIT_DELETE_USER_POST = API_BASE_URL + '/posts/';
const GET_POST_DETAILS = EDIT_DELETE_USER_POST;

export {
  API_BASE_URL,
  USER_SIGNUP_URL,
  USER_LOGIN_URL,
  GET_POSTS_URL,
  CREATE_POST_URL,
  GET_USER_POSTS_URL,
  EDIT_DELETE_USER_POST,
  GET_POST_DETAILS,
};
