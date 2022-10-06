const express = require("express");
const passport = require("passport");
const {
  homeController,
  signUp,
  signIn,
  signingUp,
  signingIn,
  signOut,
  profile,
  editProfile,
  updateProfile,
} = require("../controllers");

const router = express.Router();
// const app = express();

router.get("/", homeController);

router.get("/sign-up", signUp);

router.get("/sign-in", signIn);

router.post("/signing-up", signingUp);

//using passport as a middleware to authenticate the user..
router.post(
  "/signing-in",
  passport.authenticate("local", {
    failureRedirect: "/sign-in",
    failureFlash: true,
  }),
  signingIn
);
router.get("/profile", passport.checkAuthentication, profile);

router.get("/edit-profile", passport.checkAuthentication, editProfile);

router.post("/update-profile", updateProfile);

router.get("/sign-out", signOut);


router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/sign-in'}), signingIn);



module.exports = router;
