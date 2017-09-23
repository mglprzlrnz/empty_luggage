const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const mongoose = require('mongoose');

require('./configs/db.config');
require('./configs/passport.config').setup(passport);
const corsOptions = require('./configs/cors.config');

const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const tripRoutes = require('./routes/trip.route');

const app = express();

app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'SuperSecret',
  resave: true,
  saveUninitialized: true,
  cookie: { httpOnly: true, maxAge: 2419200000 }
}));
app.use(passport.initialize());
app.use(passport.session());

const apiPrefix = '/api'
app.use(`${apiPrefix}`, authRoutes);
app.use(`${apiPrefix}/user`, userRoutes);
app.use(`${apiPrefix}/trips`, tripRoutes);

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (err instanceof mongoose.Error.ValidationError) {
    err.status = 400;
  }
  res.status(err.status || 500);
  res.json({ message: err.message });
});

module.exports = app;
