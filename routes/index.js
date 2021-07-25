const express = require('express');
const Banner = require('../models/banner');
const User = require('../models/user');
const Works = require('../models/works');
const Ufollow = require('../models/ufollow');
const Suggest = require('../models/suggest');
const FeedBack = require('../models/feedback');
const Notice = require('../models/notice');
const Icomment = require('../models/index_comment');
const crypto = require('crypto');
const router = express.Router();
const moment = require('moment');
const common = require('./common');
const jwt = require('jsonwebtoken');
const config = require('../config');
moment.locale('zh-CN');

let govname = '特慧编';
let pagetitle = '首页 | 特慧编';

router.get('/', function (req, res, next) {
  res.json({message: 'Welcome to the THB-APIs'})
});

/* GET 首页info */
router.get('/homeInfo', function (req, res, next) {
  let _user = req.session.user;
  if (_user) {
    res.locals.user = _user;
  }
  Banner.find({}).exec(function (err, banners) {
    Works.find({})
      .sort({ zan: -1 })
      .limit(10)
      .populate('user', 'headimg nickname')
      .exec(function (err, hotlist) {
        if (err) {
          console.log(err);
        }
        Works.find({})
          .sort({ keep: -1 })
          .limit(10)
          .populate('user', 'headimg nickname')
          .exec(function (err, keeplist) {
            if (err) {
              console.log(err);
            }
            Works.find({})
              .sort({ 'meta.createAt': -1 })
              .limit(10)
              .populate('user', 'headimg nickname')
              .exec(function (err, newlist) {
                if (err) {
                  console.log(err);
                }
                Works.find({ isShow: true })
                  .sort({ keep: -1 })
                  .populate('user', 'headimg nickname')
                  .exec(function (err, showlist) {
                    if (err) {
                      console.log(err);
                    }
                    Icomment.find({}).exec(function (err, index_com) {
                      if (err) {
                        console.log(err);
                      }
                      res.send({
                        status: 'success',
                        homeinfo: {
                          title: pagetitle,
                          banners: banners,
                          hotlist: hotlist,
                          keeplist: keeplist,
                          newlist: newlist,
                          showlist: showlist,
                          icomment: index_com,
                        },
                      });
                    });
                  });
              });
          });
      });
  });
});

/*  产品简介  */
router.get('/ourjob', function (req, res, next) {
  let _user = req.session.user;
  if (_user) {
    res.locals.user = _user;
  }
  res.render('support', {
    title: pagetitle,
  });
});

/*  登录接口  */
router.post('/signin', function (req, res, next) {
  const userhash = crypto.createHash('sha1');
  const user_name = req.body.username;
  const user_pwd = req.body.userpwd;

  if (user_name && user_pwd) {
    const hash_pwd = userhash.update('thb').update(user_pwd).digest('hex');
    User.fetchByName(user_name, function (err, usermsg) {
      if (err) {
        console.log(err);
        res.send({
          status: 'fail',
          msg: '服务器抢修中，暂时无法登陆',
        });
      } else {
        if (usermsg.length == 0) {
          res.send({
            status: 'nouser',
            msg: '账号或密码错误',
          });
        } else {
          if (hash_pwd == usermsg[0].password) {
            if (usermsg[0].status == -1) {
              res.send({
                status: 'banned',
                msg: '你的账号已被封禁，如有疑问请联系管理员',
              });
            } else {
              req.session.user = usermsg[0];
              const payload = { username: user_name, userid: usermsg[0]._id };
              const token = jwt.sign(payload, config.secret, { expiresIn: '1d' });
              res.send({
                status: 'success',
                token,
              });
            }
          } else {
            res.send({
              status: 'pwderror',
              msg: '账号或密码错误',
            });
          }
        }
      }
    });
  }
});

/*  注册接口  */
router.post('/register', function (req, res, next) {
  const userhash = crypto.createHash('sha1');
  const user_name = req.body.username;
  const nick_name = req.body.nickname;
  const user_pwd = req.body.userpwd;
  let _usermsg;
  if (user_name && user_pwd) {
    const hash_pwd = userhash.update('thb').update(user_pwd).digest('hex');
    User.fetchByName(user_name, function (err, data) {
      if (err) {
        console.log(err);
        res.send({
          status: 'fail',
          msg: '服务器抢修中，暂时无法注册',
        });
      } else {
        if (data.length == 0) {
          _usermsg = new User({
            username: user_name,
            password: hash_pwd,
            nickname: nick_name,
            realname: '',
            headimg: '/img/headimg/person-icon.png',
            email: '',
            phoneNum: '',
            qq: '',
            wx: '',
            motto: '欢迎来跟我交朋友~',
            noticenum: 1,
          });
          _usermsg.save(function (err, data) {
            if (err) {
              console.log(err);
              res.send({
                status: 'fail',
              });
            } else {
              req.session.user = data;
              let new_notice = new Notice({
                user: data._id,
                message: [
                  {
                    title: '欢迎来到特慧编社区',
                    content:
                      '【欢迎来你到特慧编社区】很高兴你能成为我们的一员，在这里你将体验不一样的编程乐趣，我们搭载了最新的 THB Creation，赶紧去体验吧！',
                    createAt: moment(new Date()).format('LL'),
                  },
                ],
              });
              new_notice.save(function (err) {
                if (err) {
                  console.log(err);
                }
                let new_ufans = new Ufollow({
                  userid: data._id,
                });
                new_ufans.save(function (err) {
                  if (err) {
                    console.log(err);
                  }
                  res.send({
                    status: 'success',
                  });
                });
              });
            }
          });
        } else {
          res.send({
            status: 'fail',
            msg: '该账号已被其他用户注册',
          });
        }
      }
    });
  }
});

// 修改密码
function hashpwd(user_pwd) {
  const userhash = crypto.createHash('sha1');
  return userhash.update('thb').update(user_pwd).digest('hex');
}
router.post('/users/change/password', function (req, res, next) {
  const oldpwd = req.body.old_pwd;
  const newpwd = req.body.new_pwd;
  let _user = req.session.user;
  if (_user && oldpwd && newpwd) {
    User.findOne({ _id: _user._id }).exec(function (err, user_msg) {
      if (err) console.log(err);
      if (user_msg.password == hashpwd(oldpwd)) {
        User.updateOne({ _id: _user._id }, { $set: { password: hashpwd(newpwd) } }).exec(function (err) {
          res.send({
            status: 'success',
          });
        });
      } else {
        res.send({
          status: 'fail',
          msg: '旧密码错误',
        });
      }
    });
  } else {
    res.send({
      status: 'fail',
      msg: '修改失败',
    });
  }
});

// 退出登录
router.get('/logout', function (req, res, next) {
  delete req.session.user;
  res.send({
    status: 'success',
  });
});

// 关于我们
router.get('/aboutus', function (req, res, next) {
  let _user = req.session.user;
  if (_user) {
    res.locals.user = _user;
  }
  res.render('aboutus', {
    title: pagetitle,
  });
});

// 关于我们-地图
router.get('/map', function (req, res, next) {
  res.render('map', {
    title: pagetitle,
  });
});

// 产品建议
router.get('/suggest', function (req, res, next) {
  let _user = req.session.user;
  if (_user) {
    res.locals.user = _user;
  }
  res.render('suggest', {
    title: pagetitle,
  });
});

// 产品建议接口
router.post('/user/suggest', function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    let suggest = {
      user: req.body.userid,
      content: req.body.content,
    };
    if (suggest.content && suggest.user) {
      new Suggest(suggest).save(function (err) {
        if (err) {
          console.log(err);
        }
        res.send({
          status: 'success',
        });
      });
    } else {
      res.send({
        status: 'fail',
      });
    }
  });
});

// 问题反馈
router.get('/feedback', function (req, res, next) {
  let _user = req.session.user;
  if (_user) {
    res.locals.user = _user;
  }
  res.render('feedback', {
    title: pagetitle,
  });
});

// 问题反馈接口
router.post('/user/feedback', function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    let feedback = {
      user: req.body.userid,
      content: req.body.content,
    };
    if (feedback.content && feedback.user) {
      new FeedBack(feedback).save(function (err) {
        if (err) {
          console.log(err);
        }
        res.send({
          status: 'success',
        });
      });
    } else {
      res.send({
        status: 'fail',
      });
    }
  });
});

module.exports = router;
