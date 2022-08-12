const express = require('express'),
      router = express.Router();

router.get('/', (req, res, next) => {
  res.redirect('/timeline');
});

module.exports = router;