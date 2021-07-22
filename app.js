const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoStore = require('connect-mongo')(session);

const index = require('./routes/index');
const users = require('./routes/users');
const works = require('./routes/works');
const pythonide = require('./routes/python');
var lessons = require('./routes/lessons');
const creation = require('./routes/creation');
// admin
const admin = require('./routes/admin_index');
// db
const dbUser = 'xxxx';
const dbPwd = 'xxxxxxxx';
const dbAuth = dbUser + ':' + dbPwd || '';
const dbMsg = '?authSource=admin' || '';
const dbUrl = 'mongodb://' + dbAuth + '@localhost:27017/xxxxx' + dbMsg;
const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(dbUrl);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '500mb', extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "/public")));
app.use(
  session({
    resave: false,
    secret: 'xxxxxxxx',
    saveUninitialized: true,
    store: new mongoStore({
      url: dbUrl,
      collection: 'xxxxxx',
    }),
    cookie: { maxAge: 86400 },
  })
);

app.use('/', index);
app.use('/users', users);
app.use('/works', works);
app.use('/pythonide', pythonide);
app.use('/lessons', lessons);
app.use('/creation', creation);
app.use('/thbadmin', admin);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
