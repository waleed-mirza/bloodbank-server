const router = require("express").Router();
const User = require("../models/user");
const verifyToken = require("./verifyToken");

router.post("/login", async (req, res) => {
  //Checking if the email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.json({
      staus: "not ok",
      auth: false,
      message: "No email found",
    });
  // if (!user) return res.status(400).send("Email not found");

  //Checking if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    return res.json({
      staus: "not ok",
      auth: false,
      message: "Password is wrong",
    });
  }
  //Create and assign a token
  const id = user._id,
    email = user.email;
  const token = jwt.sign({ id, email }, process.env.TOKEN_SECRET);
  const result = user;
  res.json({
    staus: "ok",
    auth: true,
    token: token,
    result: result,
  });
});
router.post("/register", async (req, res) => {
  try {
    //Checking if the user is already registered
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist)
      return res.send({
        status: "not ok",
        message: "Email Already Registered",
      });

    //Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const userData = new User({
      fullname: req.body.fullname,
      email: req.body.email,
      password: hashedPassword,
      dob: req.body.dob,
      gender: req.body.gender,
      bloodgroup: req.body.bloodgroup,
    });
    await userData.save();
    res.status(200).json({ staus: "ok", message: "register successfully" });
  } catch (err) {
    res.status(500).json({ staus: "not ok", message: "Server error" });
  }
});

router.get("/login", verifyToken, async (req, res) => {
  if (req.userID) {
    return res.send({ auth: true, loggedIn: true, id: req.userID });
  } else {
    return res.send({
      auth: false,
      loggedIn: false,
      message: "Failed to authenticate",
    });
  }
});
module.exports = router;
