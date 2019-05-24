const router = require("express").Router()
const todoCont = require('../controllers/todoCont')
const Authorize = require('../middlewares/authorize')
const Authenticate = require('../middlewares/authenticate')

router.post('/create', Authenticate, todoCont.create)
router.get('/read', Authenticate, todoCont.read)
router.get('/read/search', Authenticate, todoCont.search)
router.get('/read/:id', Authenticate, Authorize, todoCont.readOne)
router.put('/update/:id', Authenticate, Authorize, todoCont.update)
router.delete('/delete/:id', Authenticate, Authorize, todoCont.delete)

module.exports = router