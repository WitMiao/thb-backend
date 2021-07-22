const express = require("express");
const Lesson = require("../models/lesson");
const Lcomment = require("../models/lcomment");
const router = express.Router();
const moment = require("moment");
const common = require("./common");
moment.locale("zh-CN");

let pagetitle = " | 特慧编";

router.get("/", function (req, res, next) {
  let _user = req.session.user;
  if (_user) {
    res.locals.user = _user;
  }
  Lesson.find({}).exec(function (err, lessonlist) {
    if (err) {
      console.log(err);
    }
    res.render("lessons", {
      title: "视频列表"+pagetitle,
      lessonlist: lessonlist,
    });
  });
});

/* GET lesson 详情页. */
router.get("/content/:id", function (req, res, next) {
  let lessonsid = req.params.id;
  let _user = req.session.user;
  if (_user) {
    res.locals.user = _user;
  }
  Lesson.find({ _id: lessonsid }).exec(function (err, lessondata) {
    if (lessondata) {
      Lesson.updateLooks(lessonsid, function (err) {
        if (err) console.log(err);
      });
      Lcomment.find({ lessons: lessonsid })
        .sort({ "meta.createAt": -1 })
        .populate("fromid", "headimg nickname")
        .populate("reply.fromid reply.toid", "headimg nickname")
        .exec(function (err, lcomments) {
          if (lcomments.length > 0) {
            for (let i = 0; i < lcomments.length; i++) {
              let replylist = lcomments[i].reply;
              for (let ii = 0; ii < replylist.length; ii++) {
                replylist[ii].time = moment(replylist[ii].createAt)
                  .startOf("minute")
                  .fromNow();
              }
              lcomments[i].time = moment(lcomments[i].meta.createAt)
                .startOf("minute")
                .fromNow();
            }
          }
          res.render("lessons_content", {
            title: lessondata[0].title + pagetitle,
            lessons: lessondata[0],
            lcomments: lcomments,
          });
        });
    } else {
      res.redirect("error");
    }
  });
});

/* 评论. */
router.post("/ucomment", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const ucomment_msg = req.body;
    if (ucomment_msg.lessons && ucomment_msg.fromid && ucomment_msg.content) {
      let ucomment = new Lcomment(ucomment_msg);
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
/* 评论.叠楼 */
router.post("/ucomment/second", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const _comment = req.body;
    if (_comment.lessons) {
      const reply = {
        fromid: _comment.fromid,
        toid: _comment.toid,
        content: _comment.content,
      };
      Lcomment.findById(_comment.lessons, function (err, creply) {
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

router.post("/ucomment/fzan", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const _zanId = req.body.zanid;
    const myid = req.body.myid;
    const zan_status = req.body.acnum;
    if (_zanId && myid) {
      if (zan_status == 1) {
        Lcomment.zanAddById(_zanId, myid, function (err, zandata) {
          if (err) {
            console.log(err);
          }
          res.send({
            status: "success",
          });
        });
      } else {
        Lcomment.zanReduceById(_zanId, myid, function (err, zandata) {
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
        Lcomment.szanAddById(_zanId, s_zanId, myid, function (err, zandata) {
          if (err) {
            console.log(err);
          }
          res.send({
            status: "success",
          });
        });
      } else {
        Lcomment.szanReduceById(_zanId, s_zanId, myid, function (err, zandata) {
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
module.exports = router;
