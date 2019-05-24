const router = require("express").Router()
const todo = require('./todoRoutes')
const user = require("./userRoutes")

router.get("/", (req, res) => {
  res.status(200).json({ msg: 'connected' })
})

router.use("/todos", todo)
router.use("/users", user)

module.exports = router