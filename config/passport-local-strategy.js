const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const bycrypt = require("bcrypt");
const User = require("../models/user");

//authenticating using passport

passport.use(
  new LocalStrategy( //localstrategy is used to find the user who signed in and then authenticating them..
    {
      usernameField: "email", //unique field in our model...
    },
    function (email, password, done) {
      User.findOne({ email: email }, async function (err, user) {
        if (err) {
          console.log("err in finding the user", err);
          return done(err);
        }

        //user not found or password not matched..
        // if (!user || user.password != password) {
        if (!user) {
          console.log("Invalid User name -- password..");
          
          return done(null, false); //null->for err ...  false->authentication not done
        }
        //if user found..
        const isMatched = await bycrypt.compare(password, user.password);
        if(isMatched){
          return done(null, user);
        }
        return done(err);
      });
    }
  )
);

//serializing the user...setting cookie
passport.serializeUser(function (user, done) {
  return done(null, user._id);
});

//deserialising the user.. from the key in cookies..
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log(err);
      return done(err);
    }
    return done(null, user);
  });
});

passport.checkAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    //is authenticated is given by passport
    //checks if user is signed in or not..
    return next(); //calling next means when middleware is done then it will go to next middleware
  }
  //if user not authenticated...means not signed in..
  return res.redirect("/sign-in");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    //req.user contains the current signed in user from the session cookie, we sending it to locals for views..
    res.locals.user = req.user;
  }
  next();
};
module.exports = passport;
