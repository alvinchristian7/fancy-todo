require('dotenv').config()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const randomPass = require('../helpers/randomPass')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class UserController {
  static GoogleSignIn(req, res) {
    let payload = null;
    client.verifyIdToken({
      idToken: req.body.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    })
      .then((ticket) => {
        payload = ticket.getPayload();
        const userid = payload['sub']
        console.log(payload)
        return User.findOne({ email: payload.email })
      })
      .then((user) => {
        if (user) {
          let { name } = user
          let payload = {
            _id: user._id,
            name: user.name,
            email: user.email
          }
          let token = jwt.sign(payload, process.env.KUNCI)
          console.log('token --->', token, '<---token')
          res.status(200).json({ token, name })
        } else {
          let passRandom = randomPass()
          User.create({
            name: payload.name,
            email: payload.email,
            password: passRandom
          })
            .then((user) => {
              let { name } = user
              let payload = {
                _id: user._id,
                name: user.name,
                email: user.email
              }
              let token = jwt.sign(payload, process.env.KUNCI)
              console.log('token --->', token, '<---token')
              res.status(200).json({ token, name, passRandom })
            })
            .catch((err) => {
              res.status(500).json(err)
            })
        }
      })
      .catch((err) => {
        console.log(err)
        res.status(500).json(err)
      })
  }

  static register(req, res) {
    User
      .create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      })
      .then(user => {
        console.log(user)
        return User.findOne({ email: req.body.email })
      })
      .then(user => {
        if (user) {
          let { name } = user
          let payload = {
            _id: user._id,
            name: user.name,
            email: user.email
          }
          let token = jwt.sign(payload, process.env.KUNCI)
          console.log('token register -->', token)
          res.status(200).json({
            token, name
          })
        } else {
          res.status(404).json({
            message: "User Not Found"
          })
        }
      })
      .catch(err => {
        if(err.message) {  
          res.status(406).json({
            message: err.message
          })
        }
        else res.status(500).json({
          message: "Internal Server Error Login"
        })
      })
  }

  static login(req, res) {
    User
      .findOne({
        email: req.body.email
      })
      .then(user => {
        if (user) {
          const isSame = bcrypt.compareSync(req.body.password,user.password)
          if(isSame){
            let { name } = user
            let payload = {
              _id: user._id,
              name: user.name,
              email: user.email
            }
            let token = jwt.sign(payload, process.env.KUNCI)
            console.log('token login -->', token)
            res.status(200).json({
              token, name
            })
          }
          else {
            res.status(403).json({
              message: 'Email atau password salah'
            })
          }
        } 
        else {
          res.status(404).json({
            message: "Email atau password salah"
          })
        }
      })
      .catch(err => {     
        if(err.message) {  
          res.status(406).json({
            message: err.message
          })
        }
        else res.status(500).json({
          message: "Internal Server Error Login"
        })
      })
  }

  static logout(req, res) {
    // i dunno
  }
}

module.exports = UserController