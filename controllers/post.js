const Post = require('../models/Post'),
      User = require('../models/User'),
      Comment = require('../models/Comment'),
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

exports.timeline_GET = (req, res, next) => {
  return (async () => {
    const user = res.locals.user;
    let timeline = [], arr;

    // collect posts from user
    arr = await Post.find({user}).populate('comments').populate('user').exec();
    timeline.push(...arr);

    // collect posts from each friend of user
    const friends = user.friends;
    for (const i in user.friends) {
      arr = await Post.find({user: friends[i]}).populate('comments').populate('user').exec();
      timeline.push(...arr);
    }

    // organize by date newest to oldest
    timeline = timeline.sort((a, b) => b.date - a.date);

    // return array of posts
    return res.render('index', {title: 'Timeline', user: res.locals.user, posts: timeline});
  })();
}