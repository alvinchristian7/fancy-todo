const router = require("express").Router()
const UserCont = require('../controllers/userCont')

router.post('/register', UserCont.register)
router.post('/login',UserCont.login)
router.post('/signinGoogle', UserCont.GoogleSignIn)
// router.post('/logout',userCont.logout)
// router.update('/update/:id', userCont.update)
// router.delete('/delete/:id', userCont.delete)

module.exports = router