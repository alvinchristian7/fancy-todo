const express = require('express')
const app = express()
const routes = require('./routes')
const mongoose = require('mongoose')
const cors = require('cors')
const url = `mongodb+srv://admin:admin@fancy-todo-ubnfm.mongodb.net/test?retryWrites=true`
const port = process.env.PORT || 3000

// mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false)
mongoose.connect(url, { useNewUrlParser: true })
  .then(() => {
    console.log('======> MongoDB Connected <=======');
  })
  .catch((err) => { console.log(err) })

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
app.use("/", routes)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})