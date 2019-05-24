const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

let Schema = mongoose.Schema

let user = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate: [{
      validator: function (email) {
        var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
        return emailRegex.test(email)
      },
      message: `Email gak valid`
    }],
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  todos: [{
    type: Schema.Types.ObjectId,
    ref: 'Todos'
  }]
})

user.pre('findOne', function (next) {
  var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
  if(emailRegex.test(this._conditions.email)) next()
  else next("Not a valid email address")
})
user.pre('save', function (next) {
  let salt = bcrypt.genSaltSync(8);
  let hash = bcrypt.hashSync(this.password, salt);
  this.password = hash
  next()
})

let User = mongoose.model('Users', user)

module.exports = User