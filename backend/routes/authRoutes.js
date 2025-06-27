const router = require('express').Router();
const { signup, login, sendPhoneOtp } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;