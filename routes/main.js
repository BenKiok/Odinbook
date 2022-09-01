const express = require('express'),
      router = express.Router(),
      post_controller = require('../controllers/post');

router.post('/:user/new/post', post_controller.new_post_POST);

router.get('/timeline', (req, res, next) => {
  res.render('index', {title: 'Timeline', user: res.locals.user});
});

module.exports = router;