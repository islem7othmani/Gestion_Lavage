const { register, login, verifyEmail, forgotPassword, resetPassword } = require("../Controllers/User.controller");
const { isAdmin } = require('../MiddleWares/isAdmin');  

const route = require("express").Router();

route.post("/register", register);
route.post("/login", login);
route.post("/verified/:activationCode", verifyEmail);
route.post("/forgetpassword", forgotPassword);
route.post("/resetpassword", resetPassword);
route.get("/admin", isAdmin);

module.exports = route;
