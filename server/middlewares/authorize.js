const Todo = require('../models/todo')
const mongoose = require('mongoose')
const ObjectId = mongoose.mongo.ObjectId

module.exports = (req, res, next) => {
  Todo.findOne({_id: ObjectId(req.params.id)})
  .populate('user')
  .then(row=>{
    console.log("Authorize",row.user._id.equals(req.decoded._id))
    if(row.user._id.equals(req.decoded._id)){
      next()
    }
    else{
      res.status(401).json({
        message: 'Not Authorized'
      })
    }
  })
  .catch(err=>{
    res.status(400).json({
      message: "Todo gak ketemu"
    })
  })
}