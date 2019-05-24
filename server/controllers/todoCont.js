require('dotenv').config()
const mongoose = require('mongoose')
const Todo = require('../models/todo')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const ObjectId = mongoose.mongo.ObjectId

class TodoController {
  static create(req,res){
    console.log(req.decoded)
    Todo.create({
      user: ObjectId(req.decoded._id),
      title: req.body.title,
      description: req.body.description,
      status: "unfinished",
      duedate: req.body.duedate,
    })
    .then(result=>{
      res.status(201).json(result)
    })
    .catch(err => {
      res.status(500).json({
        message: "Failed to create new Todo",
        err
      })
    })
  }
  static read(req,res){
    // console.log("READ",req.decoded)
    Todo.find({user: ObjectId(req.decoded._id)})
    .then(result=>{
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json({
        message: "Failed to read Todos",
        err
      })
    })
  }
  static search(req,res){
    // console.log("SEARCH",req.decoded)
    let obj = {user: ObjectId(req.decoded._id)}
    if(req.query.status) obj.status = req.query.status
    Todo.find(obj)
    .then(result=>{
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json({
        message: "Failed to read Todos",
        err
      })
    })
  }
  static readOne(req,res){
    // let obj = {}
    // if(req.query.bookId) obj.booklist = req.query.bookId

    Todo.findOne({
      user: ObjectId(req.decoded._id),
      _id: req.params.id
    })
    .then(result=>{
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json({
        message: "Failed to read Todos",
        err
      })
    })
  }
  static update(req,res){
    // Todo.findById(ObjectId(req.body.id))
    // .then(result=>{
    //   // if(req.body.status == result.status) req.body.status = result.status
    //   const newDueDate = new Date(req.body.duedate)
    //   // if(newDueDate == result.duedate) newDueDate = result.duedate
    //   return Todo.findByIdAndUpdate(ObjectId(req.body.id),{
    //     title: req.body.title,
    //     description: req.body.description,
    //     status: req.body.status,
    //     duedate: newDueDate,
    //   })
    // })
    Todo.findByIdAndUpdate(ObjectId(req.params.id),{
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      duedate: req.body.duedate,
    })
    .then(result=>{
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json({
        message: "Failed to update Todo",
        err
      })
    })
  }
  static delete(req,res){
    Todo.deleteOne({_id: ObjectId(req.params.id)})
    .then(result=>{
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json({
        message: "Failed to delete Todo",
        err
      })
    })
  }
}

module.exports = TodoController