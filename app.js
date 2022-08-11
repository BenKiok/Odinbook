const createError = require('http-errors'),
      express = require('express'),
      path = require('path'),
      cookieParser = require('cookie-parser'),
      logger = require('morgan'),
      mongoose = require('mongoose'),
      session = require('express-session'),
      passport = require('passport');
require('dotenv').config();
require('./passport');

const authRouter = require('./routes/auth'),
      mainRouter = require('./routes/main'),
      usersRouter = require('./routes/users');

const app = express();

mongoose.connect(process.env.MONGODB, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.connection.on('connected', console.log.bind(console, 'Database connected!'));
mongoose.connection.on('error', console.error.bind(console, 'MongoDB Atlas connection error'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use('/',
  authRouter,
  passport.authenticate('local', {failureRedirect: '/login'}),
  mainRouter
);
app.use('/users', usersRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
