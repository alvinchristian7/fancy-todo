const mongoose = require('mongoose')

let Schema = mongoose.Schema

let todo = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "unfinished"
  },
  duedate: {
    type: Date
  }
})

let Todo = mongoose.model('Todos', todo)

module.exports = Todo