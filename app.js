const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoStore = require('connect-mongo')(session);
const jwt = require('jsonwebtoken');
const User = require("./models/user");
const index = require('./routes/index');
const users = require('./routes/users');
const works = require('./routes/works');
const pythonide = require('./routes/python');
var lessons = require('./routes/lessons');
const creation = require('./routes/creation');
// admin
const admin = require('./routes/admin_index');
//config
const config = require('./config');
// db
const dbAuth = config.dbUser + ':' + config.dbPwd || '';
const dbMsg = '?authSource=admin' || '';
const dbUrl = 'mongodb://' + dbAuth + '@localhost:' + config.dbPort + '/' + config.dbName + dbMsg;
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
app.use(express.static(path.join(__dirname, "/public")));
app.use(
  session({
    resave: false,
    secret: config.secret,
    saveUninitialized: true,
    store: new mongoStore({
      url: dbUrl,
      collection: config.collection,
    }),
    cookie: { maxAge: 86400 },
  })
);

/** 全局api守卫 验证token */
app.use(function (req, res, next) {
  const { path } = req;
  console.log(path);
  const pathList = [
    '/',
    '/signin',
    '/register',
    '/homeInfo',
    '/works',
    '/pythonide',
    '/lessons',
    '/creation',
    '/thbadmin/login',
    '/logout'
  ];
  if (pathList.indexOf(path) > -1) {
    next();
  } else {
    const token = req.headers.token;
    if (token) {
      jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
          res.send({
            status: 'notoken',
            msg: 'token不存在或者过期',
          });
        } else {
          const { userid } = decoded;
          User.searchStatus(userid, function (err, userinfo) {
            if (err) {
              console.log(err);
            }
            if (userinfo[0].status === -1) {
              res.send({
                status: "banned",
                msg: "你的账号已被封禁，如有疑问请联系管理员",
              });
            } else {
              next();
            }
          });
        }
      });
    } else {
      res.send({
        status: 'notoken',
        msg: 'token不存在或者过期',
      });
    }
  }
});

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
  res.send({
    status: 'error',
    msg: '服务器无响应，请重试或者联系管理员',
  });
});

module.exports = app;
