const User = require("../models/user");
const bycrpt = require("bcrypt");

module.exports.homeController = function (req, res) {
  res.render("home", {
    title: "Home",
    msg: req.flash("message"),
  });
};
module.exports.signUp = function (req, res) {
  //now we are checking if user is already authenticated then sending him to profile
  if (req.isAuthenticated()) {
    req.flash("alert", "Already Signed In");
    return res.redirect("/profile");
  }
  res.render("signup", {
    title: "Sign up",
    alert: req.flash("alert"),
  });
};

module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    req.flash("alert", "Already Signed In");
    return res.redirect("/profile");
  }
  res.render("signin", {
    title: "Sign in",
    msg: req.flash("message"),
  });
};

module.exports.signingUp = function (req, res) {
  //   console.log(req.body);
  const { email, password, name, confirm_password } = req.body;

  User.findOne({ email: email }, function (err, user) {
    if (err) {
      console.log("error", err);
      return;
    }
    if (!user) {
      //   console.log("no user");
      User.create(req.body, function (err, user) {
        if (err) {
          console.log("error", err);
          return;
        }
        //before saving password we need to encrypt it also...
        //using pre save in models
        user.save();
        console.log(user);
        console.log("User Created Successfully!!!");
        req.flash("message", "User Created Successfully!!!");
        return res.redirect("/sign-in");
      });
    } else {
      if (password != confirm_password) {
        req.flash("alert", "Password Does Not Match!!! ");
        return res.redirect("back");
      }
      // console.log("User Already Existed!!!");
      req.flash("alert", "User Already Existed, Please SignIn!!!");
      return res.redirect("/sign-in");
    }
  });
};

module.exports.signingIn = function (req, res) {
  req.flash("err", "Invalid User name -- password..");
  req.flash("message", "Signed In Successfully");
  return res.redirect("/profile");
};

module.exports.profile = function (req, res) {
  res.render("profile", {
    title: "profile",
    msg: req.flash("message"),
    alert: req.flash("alert"),
  });
};

module.exports.editProfile = function (req, res) {
  res.render("edit_profile", {
    title: "edit-profile",
  });
};
module.exports.updateProfile = async function (req, res) {
  // console.log(req.body);

  //use bycrypt-hash here to store the hashed pass after updating it..
  const pass = await bycrpt.hash(req.body.password, 10);

  User.findByIdAndUpdate(
    req.user._id,
    { password: pass }, //updating password
    function (err, user) {
      if (err) {
        console.log(err);
        return;
      }
      // console.log(user);
      req.flash("message", "Password Changed Successfully!!!");
      return res.redirect("/profile");
    }
  );
};

module.exports.signOut = function (req, res) {
  //this function is given by passport to destroy the session...
  req.logout(function (err) {
    if (err) {
      console.log(err);
      return;
    }
    req.flash("message", "Signed Out!!");
    res.redirect("/");
  });
};
