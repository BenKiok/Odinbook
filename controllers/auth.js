const User = require('../models/User'),
      bcrypt = require('bcryptjs'),
      passport = require('passport'),
      {body, validationResult} = require('express-validator');

exports.user_signup_GET = (req, res, next) => {
  res.render('signup');
}

exports.user_signup_POST = [
  body('username').notEmpty().trim().escape(),
  body('password').notEmpty(),
  body('password-confirm', 'Passwords do not match.').notEmpty().custom((value, { req }) => value === req.body.password),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('signup');
    } else {
      User.findOne({username: req.body.username}, (err, user) => {
        if (err) {
          return next(err);
        } else if (user && user.username) {
          /* TODO: rerender signup with error messages */
          res.json('User already exists.');
        } else {
          bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if (err) {
              next(err);
            }
        
            const user = new User({
              username: req.body.username,
              password: hashedPassword,
              postsLiked: [],
              friendRequestsFrom: [],
              friends: []
            });
            
            user.save((err, user) => {
              if (err) {
                return next(err);
              }
                
              passport.authenticate('local', (err, user, info) => {
                if (err || !user) {
                  return next(err);
                }
            
                req.login(user, err => {
                  if (err) {
                    return next(err);
                  }
                  
                  res.redirect('/');
                });
              })(req, res);
            });
          });
        }
      });
    }
  }
]

exports.user_login_GET = (req, res, next) => {
  res.render('login');
}

exports.user_login_POST = [
  body('username').notEmpty().trim().escape(),
  body('password').notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('index', {title: 'Timeline'});
    } else {
      passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
      })(req, res, next);
    }
  }
]

exports.facebook_login_GET = (req, res, next) => {
  passport.authenticate('facebook', {
    successRedirect: '/', 
    failureRedirect: '/login', 
    failureMessage: true
  }, (err, user, info) => {
    if (err || !user) {
      return next(err);
    }
  })(req, res);
}

exports.user_logout_GET = (req, res, next) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
}

exports.verify_auth_GET = (req, res, next) => {
  if (res.locals.user) {
    next();
  } else {
    res.redirect('/login');
  }
}