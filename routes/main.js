const express = require('express'),
      router = express.Router();

router.get('/timeline', (req, res, next) => {
  res.render('index', {title: 'Timeline'});
});

module.exports = router;