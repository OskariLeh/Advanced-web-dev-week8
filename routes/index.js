var express = require('express');
var router = express.Router();
const mongoose = require("mongoose")
const User = require("../schemas/Users")
const Todo = require("../schemas/Todo")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const jwt = require("jsonwebtoken");
const {body, validationResult} = require("express-validator")
require("./passport")(passport)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/api/user/register/",
body("password").isLength({min: 8}),
body("eamil").isEmail(),
body("password").contains('~`!@#$%^&*()-_+={}[]|\;:"<>,./?'),
body("password").contains("1234567890"),
body("password").contains('ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
body("password").contains('abcdefghijklmnopqrstuvwxyz')
 ,(req, res, next) => {
  User.findOne({email: req.body.email})
  .then(email => {
    if(email) {
      console.log(email)
      return res.status(403).send({"email":"Email alredy in use."})
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) throw err
          User.create({
            email: req.body.email,
            password: hash
          })
          .then(ok => {
            res.send("ok")
          })
        })
      })
    }
  })
})

router.post("/api/user/login/", (req, res, next) => {
  User.findOne({email: req.body.email})
  .then(user => {
    if (!user) {
      return res.status(403).send("User not find with that email.")
    } else {
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if (err) throw err
        if (isMatch){
          
          const jwtPayload = {
            id: user._id,
            email: user.email
          }
          jwt.sign(jwtPayload, process.env.SECRET, {
            expiresIn: 360
          },
          ((err, token) => {
            return res.status(200).json({success: true, token})
          }))
        }
      })
    }
  })
})

router.get("/api/private", passport.authenticate("jwt", {session: false}), (req, res, next) => {
  res.json({email: req.body.email})
})

router.post("/api/todos", passport.authenticate("jwt", {session: false}),   (req, res, next) => {
  console.log(req.body)
  Todo.findOne({user: req.body._id})
  .then(todo => {
    if (!todo){
      Todo.create({
        user: req.body._id,
        items: req.body.items
        return res.send("ok")
      })
    } else {
      let oldTodos = todo.items
      req.body.items.forEach(item => {
        oldTodos.push(item)
      }); 
      Todo.updateOne({_id: todo._id}, {items: oldTodos})
      return res.send("ok")
    }
  })
})

module.exports = router;
