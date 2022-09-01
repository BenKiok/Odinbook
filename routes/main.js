const express = require('express'),
      router = express.Router(),
      post_controller = require('../controllers/post');

router.post('/:user/new/post', post_controller.new_post_POST);
router.get('/timeline', post_controller.timeline_GET);

module.exports = router;