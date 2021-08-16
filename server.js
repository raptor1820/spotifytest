var express = require("express");
var app = express();
var cookie = require("cookie-parser");
var bcrypt = require("bcrypt");
var bodyParser = require("body-parser");
var fs = require("fs");

mongoose
  .connect(
    "mongodb://ritwic:ritwic@test-shard-00-00.yn3nf.mongodb.net:27017,test-shard-00-01.yn3nf.mongodb.net:27017,test-shard-00-02.yn3nf.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-bhbn9n-shard-0&authSource=admin&retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then(() => {
    console.log("database is connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.set("view engine", "ejs");
app.use(cookie());
app.get("/", (req, res) => {
  res.render("home");
});

app.use(express.static(__dirname + "/public"));

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/login", (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    res.json({ message: "incomplete email or password", code: "404" });
  } else {
    user.find({username:email}).then((data) =>{
      
      if (password == data[0].password)
          {
            res.cookie("working", "yes", { maxAge: 15000 });
            res.json({ message: "successful", code: "200" });
            } 
    else {
      res.json({ message: "unsuccessful", code: "404" });
    }
  })
  .catch((error)=>{
    if (error) res.json({ message: "error" });
  }} 
});

app.post("/signUp", (req, res) => {
  let tempUser = new user({
    username: req.body.email,
    password: req.body.password,
  });
  tempUser
    .save()
    .then((data) => {})
    .catch((error) => {
      console.log(error);
    });
});

function checkIfLogin(req, res, next) {
  if (req.cookies.working === "yes") {
    next();
  } else {
    res.redirect("/");
  }
}

app.get("/player", checkIfLogin, (req, res) => {
  res.render("player");
});
app.get("/logout", (req, res) => {
  res.clearCookie("working");
  res.redirect("/");
});

app.listen(3000, function (error) {
  if (error) console.log(error);
  else console.log("Server Is Running");
});
