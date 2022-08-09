const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      auth_controller = require('../controllers/auth');

router.get('/signup', auth_controller.user_signup_GET);
router.get('/login', auth_controller.user_login_GET);
router.get('/login/facebook', passport.authenticate('facebook'));
router.get('/oauth2/redirect/facebook', auth_controller.facebook_login_GET);
router.get('/logout', auth_controller.user_logout_GET);

router.post('/signup', auth_controller.user_signup_POST);
router.post('/login', auth_controller.user_login_POST);

module.exports = router;