const express = require("express");
const port = process.env.PORT || 8000;
//calling express..
const app = express();

const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const cookieParser = require("cookie-parser");

const db = require("./config/mongoose");

//requiring express session for passport..
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");

const passportGoogle = require("./config/passport-google-oauth2-strategy");

//connect-mongo for storing session data in db..
//connect mongo require the express session
const MongoStore = require("connect-mongo");

//flash message--we need express session also...
const flash = require("connect-flash");

//seting view engine...
app.set("view engine", "ejs");
app.set("views", path.join("views"));

//for parsing incoming req..
app.use(express.urlencoded());

//for parsing the session cookies..
app.use(cookieParser());

//setting up static files.....
app.use(express.static("./assets"));

//using express-ejs-layouts...
app.use(expressLayouts);

//this will extract the style from the ejs file and put it in link-in layouts
app.set("layout extractStyles", true);

app.use(
  session({
    name: "auth", //name of cookie..
    secret: "itsasecret", //a key to encode
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100, //in ms...cookie got expires after this time period
    },

    //using mongo store to store the session cookie
    store: MongoStore.create({ mongoUrl: "mongodb://localhost:27017/auth" }),
  })
);

app.use(passport.initialize());

app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());

app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`server up on port ${port}`);
});
