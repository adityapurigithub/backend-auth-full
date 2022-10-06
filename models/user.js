const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    //email and pass are the main thing for auth thats why i defined field-name in the last..
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
//hashing the password..on signing in
userSchema.pre("save", async function (next) {
  console.log("pre save");
  if (this.isModified("password")) {
    //since bycrypt.hash will always return promise and i got stucked here for about 1 day to..
    //..figure out that i have not use await keyword with this async function..
    this.password = await bcrypt.hash(this.password, 10);
    // console.log(this.password);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
