const express = require("express");
const User = require("../models/user");
const Ufollow = require("../models/ufollow");
const Ucomment = require("../models/ucomment");
const Wcomment = require("../models/wcomment");
const Lcomment = require("../models/lcomment");
const Uzan = require("../models/uzan");
const Works = require("../models/works");
const Unrel = require("../models/unreleased");
const Notice = require("../models/notice");
const UCommentip = require("../models/tip_comment_u");
const WCommentip = require("../models/tip_comment_w");
const LCommentip = require("../models/tip_comment_l");
const Worktip = require("../models/tip_work");
const Usertip = require("../models/tip_user");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const moment = require("moment");
const common = require("./common");
moment.locale("zh-CN");

let pagetitle = " | 特慧编";

/* GET userindex page. */
router.get("/userindex/:id", function (req, res, next) {
  const userId = req.params.id;
  let _user = req.session.user;
  if (_user) {
    res.locals.user = _user;
  }
  User.fetchById(userId, function (err, usermsg) {
    if (err) {
      console.log(err);
    } else {
      if (usermsg.length > 0) {
        Uzan.find({ userid: userId }, function (err, uzan_data) {
          if (err) {
            console.log(err);
          }
          Ufollow.find({ userid: userId }, function (err, ufoll_data) {
            if (err) {
              console.log(err);
            }
            Works.findByuser(userId, function (err, works_data) {
              if (err) {
                console.log(err);
              }
              res.render("user_index", {
                title: usermsg[0].username + "的个人主页" + pagetitle,
                userid: userId,
                createtime: moment(usermsg[0].meta.createAt).format("LL"),
                userinfo: usermsg[0],
                uzan: uzan_data[0],
                ufollow: ufoll_data[0],
                worksdata: works_data,
                useractive: "index",
              });
            });
          });
        });
      } else {
        res.redirect("/");
      }
    }
  });
});
/* GET user_comment page. */
router.get("/usercomment/:id", function (req, res, next) {
  const userId = req.params.id;
  let pagenum = req.query.page;
  if (!pagenum) {
    pagenum = 1;
  }
  var reg = /^[0-9]*$/;
  if (reg.test(pagenum)) {
    let _user = req.session.user;
    if (_user) {
      res.locals.user = _user;
    }
    User.fetchById(userId, function (err, usermsg) {
      if (err) {
        console.log(err);
      } else {
        Ucomment.findCount(userId, function (err, pagecount) {
          if (err) console.log(err);
          let _pagenum = (parseInt(pagenum) - 1) * 20;
          if (_pagenum < 0 || _pagenum > pagecount) {
            _pagenum = 0;
          }
          Ucomment.find({ user: userId })
            .skip(_pagenum)
            .limit(20)
            .sort({ "meta.createAt": -1 })
            .populate("fromid", "headimg nickname")
            .populate("reply.fromid reply.toid", "headimg nickname")
            .exec(function (err, ucomments) {
              if (err) {
                console.log(err);
              }
              Uzan.find({ userid: userId }, function (err, uzan_data) {
                Ufollow.find({ userid: userId }, function (err, ufoll_data) {
                  if (ucomments) {
                    for (let i = 0; i < ucomments.length; i++) {
                      let replylist = ucomments[i].reply;
                      for (let ii = 0; ii < replylist.length; ii++) {
                        replylist[ii].time = moment(replylist[ii].meta.createAt)
                          .startOf("minute")
                          .fromNow();
                      }
                      ucomments[i].time = moment(ucomments[i].meta.createAt)
                        .startOf("minute")
                        .fromNow();
                    }
                  }
                  res.render("user_comment", {
                    title: usermsg[0].username + "的个人主页" + pagetitle,
                    userid: userId,
                    createtime: moment(usermsg[0].meta.createAt).format("LL"),
                    userinfo: usermsg[0],
                    ucomments: ucomments,
                    uzan: uzan_data[0],
                    ufollow: ufoll_data[0],
                    pagecount: pagecount,
                    compageid: pagenum,
                    useractive: "comment",
                  });
                });
              });
            });
        });
      }
    });
  } else {
    res.redirect("/usercomment/" + userId + "?page=0");
  }
});

/* GET usercenter page. */
router.get("/usercenter", function (req, res, next) {
  let _user = req.session.user;
  if (_user) {
    res.locals.user = _user;
  }
  res.render("user_center", {
    title: "账号设置" + pagetitle,
  });
});

/* GET 收藏 page. */
router.get("/userkeep/:id", function (req, res, next) {
  let _user = req.session.user;
  const userId = req.params.id;
  if (_user) {
    res.locals.user = _user;
  }
  User.fetchById(userId, function (err, usermsg) {
    if (err) {
      console.log(err);
    } else {
      Uzan.find({ userid: userId }, function (err, uzan_data) {
        if (err) {
          console.log(err);
        }
        Ufollow.find({ userid: userId }, function (err, ufoll_data) {
          Works.find({ keeplist: userId })
            .populate("user", "headimg nickname")
            .exec(function (err, wkeep_data) {
              if (err) {
                console.log(err);
              }

              res.render("user_keep", {
                title: usermsg[0].username + "的个人收藏" + pagetitle,
                userid: userId,
                createtime: moment(usermsg[0].meta.createAt).format("LL"),
                userinfo: usermsg[0],
                ufollow: ufoll_data[0],
                uzan: uzan_data[0],
                worksdata: wkeep_data,
                useractive: "keep",
              });
            });
        });
      });
    }
  });
});

/* GET user_zanjob page. */
router.get("/userzan/:id", function (req, res, next) {
  let _user = req.session.user;
  const userId = req.params.id;
  if (_user) {
    res.locals.user = _user;
  }
  User.fetchById(userId, function (err, usermsg) {
    if (err) {
      console.log(err);
    } else {
      Uzan.find({ userid: userId }, function (err, uzan_data) {
        if (err) {
          console.log(err);
        }
        Ufollow.find({ userid: userId }, function (err, ufoll_data) {
          Works.find({ zanlist: userId })
            .populate("user", "headimg nickname")
            .exec(function (err, wzan_data) {
              if (err) {
                console.log(err);
              }
              res.render("user_zanjob", {
                title: usermsg[0].username + "的个人主页" + pagetitle,
                userid: userId,
                createtime: moment(usermsg[0].meta.createAt).format("LL"),
                userinfo: usermsg[0],
                ufollow: ufoll_data[0],
                uzan: uzan_data[0],
                worksdata: wzan_data,
                useractive: "zanjob",
              });
            });
        });
      });
    }
  });
});
/* GET 关注者 page. */
router.get("/userfollow/:id", function (req, res, next) {
  let _user = req.session.user;
  const userId = req.params.id;
  if (_user) {
    res.locals.user = _user;
  }
  User.fetchById(userId, function (err, usermsg) {
    if (err) {
      console.log(err);
    } else {
      Uzan.find({ userid: userId }, function (err, uzan_data) {
        if (err) {
          console.log(err);
        }
        Ufollow.find({ userid: userId })
          .populate("follist.toid", "headimg nickname")
          .exec(function (err, ufollows) {
            if (err) {
              console.log(err);
            }
            res.render("user_follow", {
              title: usermsg[0].username + "的个人主页" + pagetitle,
              userid: userId,
              createtime: moment(usermsg[0].meta.createAt).format("LL"),
              userinfo: usermsg[0],
              ufollow: ufollows[0],
              uzan: uzan_data[0],
              ufollist: ufollows[0].follist,
              useractive: "none",
            });
          });
      });
    }
  });
});

/* GET 粉丝者 page. */
router.get("/userfans/:id", function (req, res, next) {
  let _user = req.session.user;
  const userId = req.params.id;
  if (_user) {
    res.locals.user = _user;
  }
  User.fetchById(userId, function (err, usermsg) {
    if (err) {
      console.log(err);
    } else {
      Uzan.find({ userid: userId }, function (err, uzan_data) {
        if (err) {
          console.log(err);
        }
        Ufollow.find({ userid: userId })
          .populate("fanslist.toid", "headimg nickname")
          .exec(function (err, ufans) {
            if (err) {
              console.log(err);
            }
            res.render("user_fans", {
              title: usermsg[0].username + "的个人主页" + pagetitle,
              userid: userId,
              createtime: moment(usermsg[0].meta.createAt).format("LL"),
              userinfo: usermsg[0],
              ufollow: ufans[0],
              uzan: uzan_data[0],
              ufanslist: ufans[0].fanslist,
              useractive: "none",
            });
          });
      });
    }
  });
});

/* GET 我的作品 page. */
router.get("/userworks/:type", function (req, res, next) {
  let _user = req.session.user;
  let _type = req.params.type;
  if (_user) {
    res.locals.user = _user;
    const userId = _user._id;
    if (_type == "unreleased") {
      Unrel.find({ user: userId }).exec(function (err, worksdata) {
        res.render("user_works", {
          title: "我的作品" + pagetitle,
          typer: _type,
          worksdata: worksdata,
        });
      });
    } else if (_type == "released") {
      Works.findByuser(userId, function (err, works_data) {
        if (err) {
          console.log(err);
        }
        res.render("user_works", {
          title: "我的作品" + pagetitle,
          typer: _type,
          worksdata: works_data,
        });
      });
    } else {
      res.redirect("/error");
    }
  } else {
    res.redirect("/");
  }
});

/* 修改账号信息. */
router.post("/usercenter/change", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const set_msg = req.body;
    if (set_msg.motto.length > 80) {
      res.send({
        status: "fail",
        msg: "内容长度超多限制",
      });
    } else {
      if (set_msg.nickname || set_msg.headimg || set_msg._userid) {
        User.updateById(set_msg, function (err, data) {
          if (err) {
            console.log(err);
            res.send({
              status: "fail",
              msg: "服务器更新中，暂时无法使用此功能",
            });
          } else {
            req.session.user.nickname = set_msg.nickname;
            req.session.user.headimg = set_msg.headimg;
            req.session.user.email = set_msg.email;
            req.session.user.realname = set_msg.realname;
            req.session.user.phoneNum = set_msg.phoneNum;
            req.session.user.qq = set_msg.qq;
            req.session.user.wx = set_msg.wx;
            res.send({
              status: "success",
              msg: "保存成功",
            });
          }
        });
      } else {
        res.send({
          status: "fail",
          msg: "昵称不能为空",
        });
      }
    }
  });
});

/* 评论. */
router.post("/ucomment", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const ucomment_msg = req.body;
    if (ucomment_msg.user && ucomment_msg.fromid && ucomment_msg.content) {
      let ucomment = new Ucomment(ucomment_msg);
      ucomment.save(function (err, ucomment) {
        if (err) {
          console.log(err);
        }
        res.send({
          status: "success",
          msg: "评论成功",
        });
      });
    } else {
      res.send({
        status: "fail",
        msg: "评论失败",
      });
    }
  });
});
router.post("/ucomment/second", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const _comment = req.body;
    if (_comment.user) {
      const reply = {
        fromid: _comment.fromid,
        toid: _comment.toid,
        content: _comment.content,
      };
      Ucomment.findById(_comment.user, function (err, creply) {
        if (err) {
          console.log(err);
        } else {
          if (creply.length > 0) {
            creply[0].reply.push(reply);
            creply[0].save(function (err, comment) {
              if (err) {
                console.log(err);
              }
              res.send({
                status: "success",
                msg: "评论成功",
              });
            });
          }
        }
      });
    }
  });
});

router.post("/ucomment/uzan", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const userid = req.body.userid;
    const zuid = req.body.zuid;
    const zan_status = req.body.acnum;
    if (userid && zuid) {
      Uzan.findById(userid, function (err, uzan) {
        if (uzan.length > 0) {
          if (zan_status == 1) {
            Uzan.zanAddById(userid, zuid, function (err, uzan_data) {
              if (err) {
                console.log(err);
              }
              res.send({
                status: "success",
              });
            });
          } else {
            Uzan.zanReduceById(userid, zuid, function (err, uzan_data) {
              if (err) {
                console.log(err);
              }
              res.send({
                status: "success",
              });
            });
          }
        } else {
          let zanlist = [];
          zanlist.push(zuid);
          const uzan_msg = {
            userid: userid,
            zanlist: zanlist,
            total: 1,
          };
          let new_uzan = new Uzan(uzan_msg);
          new_uzan.save(function (err, new_uzan_back) {
            if (err) {
              console.log(err);
            }
            res.send({
              status: "success",
              msg: "点赞成功",
            });
          });
        }
      });
    } else {
      res.send({
        status: "fail",
      });
    }
  });
});
// 关注
router.post("/ufoll", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const userid = req.body.userid;
    const myid = req.body.myid;
    let _follist = {
      toid: userid,
    };
    let _fanslist = {
      toid: myid,
    };
    const foll_status = req.body.acnum;
    if (userid && myid) {
      if (foll_status == 1) {
        Ufollow.fansAddById(userid, _fanslist, function (err) {
          if (err) {
            console.log(err);
          }
          Ufollow.follAddById(myid, _follist, function (err) {
            if (err) {
              console.log(err);
            }
            res.send({
              status: "success",
            });
          });
        });
      } else {
        Ufollow.fansReduceById(userid, myid, function (err) {
          if (err) {
            console.log(err);
          }
          Ufollow.follReduceById(myid, userid, function (err) {
            if (err) {
              console.log(err);
            }
            res.send({
              status: "success",
            });
          });
        });
      }
    } else {
      res.send({
        status: "fail",
      });
    }
  });
});
router.post("/ucomment/fzan", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const _zanId = req.body.zanid;
    const myid = req.body.myid;
    const zan_status = req.body.acnum;
    if (_zanId && myid) {
      if (zan_status == 1) {
        Ucomment.zanAddById(_zanId, myid, function (err, zandata) {
          if (err) {
            console.log(err);
          }
          res.send({
            status: "success",
          });
        });
      } else {
        Ucomment.zanReduceById(_zanId, myid, function (err, zandata) {
          if (err) {
            console.log(err);
          }
          res.send({
            status: "success",
          });
        });
      }
    } else {
      res.send({
        status: "fail",
      });
    }
  });
});
router.post("/ucomment/szan", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const _zanId = req.body.fzanid;
    const s_zanId = req.body.szanid;
    const myid = req.body.myid;
    const zan_status = req.body.acnum;
    if (_zanId && s_zanId && myid) {
      if (zan_status == 1) {
        Ucomment.szanAddById(_zanId, s_zanId, myid, function (err, zandata) {
          if (err) {
            console.log(err);
          }
          res.send({
            status: "success",
          });
        });
      } else {
        Ucomment.szanReduceById(_zanId, s_zanId, myid, function (err, zandata) {
          if (err) {
            console.log(err);
          }
          res.send({
            status: "success",
          });
        });
      }
    } else {
      res.send({
        status: "fail",
      });
    }
  });
});

//删除发布过的作品
router.post("/delete/rels", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const works_id = req.body.id;
    const works_locals = req.body.locals;
    const works_covers = req.body.covers;
    Works.remove({ _id: works_id }).exec(function (err, backdata) {
      if (err) {
        res.send({
          status: "fail",
        });
      }
      res.send({
        status: "success",
      });

      fs.unlink("./public/released/creation/" + works_locals, function (err) {
        if (err) {
          console.log(err);
        }
      });

      fs.unlink("./public/released/covers/" + works_covers, function (err) {
        if (err) {
          console.log(err);
        }
      });
    });
  });
});

//删除未发布的作品
router.post("/delete/unrel", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const works_id = req.body.id;
    const works_locals = req.body.locals;
    const works_covers = req.body.covers;
    Unrel.remove({ _id: works_id }).exec(function (err, backdata) {
      if (err) {
        res.send({
          status: "fail",
        });
      }
      res.send({
        status: "success",
      });

      fs.unlink("./public/unreleased/creation/" + works_locals, function (err) {
        if (err) {
          console.log(err);
        }
      });

      fs.unlink("./public/unreleased/covers/" + works_covers, function (err) {
        if (err) {
          console.log(err);
        }
      });
    });
  });
});

// 查询站内推送
router.get("/ts", function (req, res, next) {
  let _user = req.session.user;
  if (_user) {
    _user.noticenum = 0;
    res.locals.user = _user;
  }
  const userId = _user._id;
  Notice.findById(userId, function (err, notices) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      User.updateNoticenum(userId, function (err) {
        if (err) {
          console.log(err);
          res.redirect("/");
        } else {
          res.render("notice", {
            title: "站内消息" + pagetitle,
            notices: notices[0],
          });
        }
      });
    }
  });
});

router.post("/delete/notice/one", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const nid = req.body.nid;
    const uid = req.body.uid;
    if (nid && uid) {
      Notice.deleteOne(nid, uid, function (err) {
        if (err) {
          console.log(err);
          res.send({
            status: "fail",
          });
        } else {
          res.send({
            status: "success",
          });
        }
      });
    } else {
      res.send({
        status: "fail",
      });
    }
  });
});

router.post("/delete/notice/all", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const uid = req.body.uid;
    if (uid) {
      Notice.deleteAll(uid, function (err) {
        if (err) {
          res.send({
            status: "fail",
          });
        } else {
          res.send({
            status: "success",
          });
        }
      });
    } else {
      res.send({
        status: "fail",
      });
    }
  });
});

//举报用户评论
router.post("/tip/comment/f", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const cid = req.body.cid;
    const uid = req.body.uid;
    const tip_msg = req.body.tipmsg;
    if (cid && uid && tip_msg) {
      let new_tips = new UCommentip({
        fromid: uid,
        toid: cid,
        comid: cid,
        content: tip_msg,
        diff: "f",
        createAt: moment(new Date()).format("LL"),
      });
      new_tips.save(function (err) {
        if (err) {
          res.send({
            status: "fail",
          });
        } else {
          res.send({
            status: "success",
          });
        }
      });
    } else {
      res.send({
        status: "fail",
      });
    }
  });
});
router.post("/tip/comment/s", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const cid = req.body.cid;
    const uid = req.body.uid;
    const tid = req.body.tid;
    const tip_msg = req.body.tipmsg;
    if (cid && uid && tid && tip_msg) {
      let new_tips = new UCommentip({
        fromid: uid,
        toid: cid,
        comid: tid,
        content: tip_msg,
        diff: "s",
        createAt: moment(new Date()).format("LL"),
      });
      new_tips.save(function (err) {
        if (err) {
          res.send({
            status: "fail",
          });
        } else {
          res.send({
            status: "success",
          });
        }
      });
    } else {
      res.send({
        status: "fail",
      });
    }
  });
});
router.post("/tip/wcomment/f", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const cid = req.body.cid;
    const uid = req.body.uid;
    const tip_msg = req.body.tipmsg;
    const types = req.body.types;
    if (cid && uid && tip_msg && types == "fwtip") {
      let new_tips = new WCommentip({
        fromid: uid,
        toid: cid,
        comid: cid,
        content: tip_msg,
        diff: "f",
        createAt: moment(new Date()).format("LL"),
      });
      new_tips.save(function (err) {
        if (err) {
          res.send({
            status: "fail",
          });
        } else {
          res.send({
            status: "success",
          });
        }
      });
    } else {
      res.send({
        status: "fail",
      });
    }
  });
});
router.post("/tip/wcomment/s", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const cid = req.body.cid;
    const uid = req.body.uid;
    const tid = req.body.tid;
    const types = req.body.types;
    const tip_msg = req.body.tipmsg;
    if (cid && uid && tid && tip_msg && types == "swtip") {
      let new_tips = new WCommentip({
        fromid: uid,
        toid: cid,
        comid: tid,
        content: tip_msg,
        diff: "s",
        createAt: moment(new Date()).format("LL"),
      });
      new_tips.save(function (err) {
        if (err) {
          res.send({
            status: "fail",
          });
        } else {
          res.send({
            status: "success",
          });
        }
      });
    } else {
      res.send({
        status: "fail",
      });
    }
  });
});

router.post("/tip/lcomment/f", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const cid = req.body.cid;
    const uid = req.body.uid;
    const tip_msg = req.body.tipmsg;
    const types = req.body.types;
    if (cid && uid && tip_msg && types == "fltip") {
      let new_tips = new LCommentip({
        fromid: uid,
        toid: cid,
        comid: cid,
        content: tip_msg,
        diff: "f",
        createAt: moment(new Date()).format("LL"),
      });
      new_tips.save(function (err) {
        if (err) {
          res.send({
            status: "fail",
          });
        } else {
          res.send({
            status: "success",
          });
        }
      });
    } else {
      res.send({
        status: "fail",
      });
    }
  });
});

router.post("/tip/lcomment/s", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const cid = req.body.cid;
    const uid = req.body.uid;
    const tid = req.body.tid;
    const types = req.body.types;
    const tip_msg = req.body.tipmsg;
    if (cid && uid && tid && tip_msg && types == "sltip") {
      let new_tips = new LCommentip({
        fromid: uid,
        toid: cid,
        comid: tid,
        content: tip_msg,
        diff: "s",
        createAt: moment(new Date()).format("LL"),
      });
      new_tips.save(function (err) {
        if (err) {
          res.send({
            status: "fail",
          });
        } else {
          res.send({
            status: "success",
          });
        }
      });
    } else {
      res.send({
        status: "fail",
      });
    }
  });
});

//删除用户评论
router.post("/delete/comment/f", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const cid = req.body.cid;
    if (cid) {
      Ucomment.deleteFById(cid, function (err) {
        if (err) {
          res.send({
            status: "fail",
          });
        } else {
          res.send({
            status: "success",
          });
        }
      });
    } else {
      res.send({
        status: "fail",
      });
    }
  });
});
router.post("/delete/comment/s", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const cid = req.body.cid;
    const types = req.body.types;
    const tid = req.body.tid;
    if (cid && tid && types == "scom") {
      Ucomment.deleteSById(cid, tid, function (err) {
        if (err) {
          console.log(err);
          res.send({
            status: "fail",
          });
        } else {
          res.send({
            status: "success",
          });
        }
      });
    } else {
      res.send({
        status: "fail",
      });
    }
  });
});
//作品页评论删除
router.post("/delete/wcomment/f", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const cid = req.body.cid;
    if (cid) {
      Wcomment.deleteFById(cid, function (err) {
        if (err) {
          res.send({
            status: "fail",
          });
        } else {
          res.send({
            status: "success",
          });
        }
      });
    } else {
      res.send({
        status: "fail",
      });
    }
  });
});
router.post("/delete/wcomment/s", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const cid = req.body.cid;
    const types = req.body.types;
    const tid = req.body.tid;
    if (cid && tid && types == "swcom") {
      Wcomment.deleteSById(cid, tid, function (err) {
        if (err) {
          console.log(err);
          res.send({
            status: "fail",
          });
        } else {
          res.send({
            status: "success",
          });
        }
      });
    } else {
      res.send({
        status: "fail",
      });
    }
  });
});
//课程页评论删除
router.post("/delete/lcomment/f", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const cid = req.body.cid;
    if (cid) {
      Lcomment.deleteFById(cid, function (err) {
        if (err) {
          res.send({
            status: "fail",
          });
        } else {
          res.send({
            status: "success",
          });
        }
      });
    } else {
      res.send({
        status: "fail",
      });
    }
  });
});
router.post("/delete/lcomment/s", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const cid = req.body.cid;
    const types = req.body.types;
    const tid = req.body.tid;
    if (cid && tid && types == "slcom") {
      Lcomment.deleteSById(cid, tid, function (err) {
        if (err) {
          console.log(err);
          res.send({
            status: "fail",
          });
        } else {
          res.send({
            status: "success",
          });
        }
      });
    } else {
      res.send({
        status: "fail",
      });
    }
  });
});
//举报用户
router.post("/tip/user", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const uid = req.body.uid;
    const _uid = req.body._uid; //被举报人
    const tip_msg = req.body.tipmsg;
    if (uid && _uid && tip_msg) {
      let new_tips = new Usertip({
        fromid: uid,
        toid: _uid,
        content: tip_msg,
        createAt: moment(new Date()).format("LL"),
      });
      new_tips.save(function (err) {
        if (err) {
          res.send({
            status: "fail",
          });
        } else {
          res.send({
            status: "success",
          });
        }
      });
    } else {
      res.send({
        status: "fail",
      });
    }
  });
});
//举报作品
router.post("/tip/work", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const uid = req.body.uid;
    const wid = req.body.wid; //被举报作品
    const tip_msg = req.body.tipmsg;
    if (uid && wid && tip_msg) {
      let new_tips = new Worktip({
        fromid: uid,
        toid: wid,
        content: tip_msg,
        createAt: moment(new Date()).format("LL"),
      });
      new_tips.save(function (err) {
        if (err) {
          res.send({
            status: "fail",
          });
        } else {
          res.send({
            status: "success",
          });
        }
      });
    } else {
      res.send({
        status: "fail",
      });
    }
  });
});
module.exports = router;
