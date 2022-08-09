var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  if (!res.locals.user) {
    res.redirect('/login');
  } else {
    res.redirect('/timeline'); 
  }
});

module.exports = router;