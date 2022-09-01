const Post = require('../models/Post'),
      User = require('../models/User'),
      {body, validationResult} = require('express-validator');

exports.new_post_POST = [
  body('body').notEmpty().trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      /* TODO: add err flash */
      return res.json(req.body);
    } else {
      User.findById(req.params.user, (err, user) => {
        if (err) {
          return next(err);
        }

        const post = new Post(
          {
            body: req.body.body,
            date: Date.now(),
            comments: [],
            likes: 0,
            user
          }
        )

        post.save((err, post) => {
          if (err) {
            return next(err);
          }

          return res.redirect('/');
        });
      });
    }
  }
]