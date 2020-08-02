var express = require("express");
var router = express.Router();

var userController = require("../controllers/userController");
const passport = require("passport");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router
  .route("/login")
  .get((req, res) => {
    res.render("auth/login");
  })
  .post(
    passport.authenticate("local", {
      session: true,
      failureRedirect: "/login",
      failureFlash: {
        type: "messageFailure",
        message: "Invalid email and/ or password.",
      },
    }),
    userController.loginUser
  );

router
  .route("/register")
  .get((req, res) => {
    res.render("auth/register");
  })
  .post(userController.registerUser);

router
  .route("/profile/:section")
  .get((req, res) => {
    if (!req.user) {
      res.redirect("/login");
      return;
    }
    res.render("auth/profile");
  })
  .post((req, res) => {
    if (req.params.section === "security") {
      userController.updatePassword(req, res);
    } else {
      userController.updateInfo(req, res);
    }
  });

router.get("/logout", userController.logoutUser);
module.exports = router;
