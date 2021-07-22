var express = require("express");
const User = require("../models/user");
const Works = require("../models/works");
const Wcomment = require("../models/wcomment");
var router = express.Router();
const moment = require("moment");
const common = require("./common");
moment.locale("zh-CN");

let pagetitle = " | 特慧编";

function renderWorks(
  res,
  pagecount,
  pagenum,
  workslist,
  _sort,
  _type,
  _searchworks
) {
  let sorturl;
  if (_searchworks) {
    sorturl = "/works?page=1&type=" + _type + "&wd=" + _searchworks + "&sort=";
  } else {
    sorturl = "/works?page=1&type=" + _type + "&sort=";
  }
  res.render("works", {
    title: "作品分享" + pagetitle,
    pagecount: pagecount,
    compageid: pagenum,
    workslist: workslist,
    sorttype: _sort,
    types: _type,
    sorturl: sorturl,
  });
}

/* GET 更多作品路由 page. */
router.get("/", function (req, res, next) {
  let pagenum = req.query.page;
  let _type = req.query.type;
  let _sort = req.query.sort;
  let _searchworks = req.query.wd;
  let _typelist = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
  ];
  // a所有 b游戏 c动画 d音乐 e模拟 f搞笑 g故事
  let _sortlist = ["time", "zan"];
  let _types = _typelist.indexOf(_type);
  let _sorts = _sortlist.indexOf(_sort);

  if (!pagenum) {
    pagenum = 1;
  }
  pagenum = parseInt(pagenum);
  var reg = /^[0-9]*$/;
  if (reg.test(pagenum) && _types !== -1 && _sorts !== -1) {
    let _user = req.session.user;
    if (_user) {
      res.locals.user = _user;
    }
    Works.findCount(function (err, pagecount) {
      if (err) console.log(err);
      let _pagenum = (parseInt(pagenum) - 1) * 30;
      if (_pagenum < 0 || _pagenum > pagecount) {
        _pagenum = 0;
      }
      if (_searchworks) {
        if (_type == "a") {
          if (_sort == "zan") {
            // 按 点赞 排序 （全部）
            Works.find({ title: { $regex: _searchworks } })
              .sort({ zan: -1 })
              .skip(_pagenum)
              .limit(30)
              .populate("user", "headimg nickname")
              .exec(function (err, workslist) {
                if (err) {
                  console.log(err);
                }
                //console.log(workslist);
                renderWorks(
                  res,
                  pagecount,
                  pagenum,
                  workslist,
                  _sort,
                  _type,
                  _searchworks
                );
              });
          } else {
            // 按 时间 排序 （全部）
            Works.find({ title: { $regex: _searchworks } })
              .sort({ "meta.createAt": -1 })
              .skip(_pagenum)
              .limit(30)
              .populate("user", "headimg nickname")
              .exec(function (err, workslist) {
                if (err) {
                  console.log(err);
                }
                renderWorks(
                  res,
                  pagecount,
                  pagenum,
                  workslist,
                  _sort,
                  _type,
                  _searchworks
                );
              });
          }
        } else {
          if (_sort == "zan") {
            // 按 点赞 排序 （全部）
            Works.find({ tags: _type, title: { $regex: _searchworks } })
              .sort({ zan: -1 })
              .skip(_pagenum)
              .limit(30)
              .populate("user", "headimg nickname")
              .exec(function (err, workslist) {
                if (err) {
                  console.log(err);
                }
                renderWorks(
                  res,
                  pagecount,
                  pagenum,
                  workslist,
                  _sort,
                  _type,
                  _searchworks
                );
              });
          } else {
            // 按 时间 排序 （全部）
            Works.find({ tags: _type, title: { $regex: _searchworks } })
              .sort({ "meta.createAt": -1 })
              .skip(_pagenum)
              .limit(30)
              .populate("user", "headimg nickname")
              .exec(function (err, workslist) {
                if (err) {
                  console.log(err);
                }
                renderWorks(
                  res,
                  pagecount,
                  pagenum,
                  workslist,
                  _sort,
                  _type,
                  _searchworks
                );
              });
          }
        }
      } else {
        if (_type == "a") {
          if (_sort == "zan") {
            // 按 点赞 排序 （全部）
            Works.find({})
              .sort({ zan: -1 })
              .skip(_pagenum)
              .limit(30)
              .populate("user", "headimg nickname")
              .exec(function (err, workslist) {
                if (err) {
                  console.log(err);
                }
                renderWorks(res, pagecount, pagenum, workslist, _sort, _type);
              });
          } else {
            // 按 时间 排序 （全部）
            Works.find({})
              .sort({ "meta.createAt": -1 })
              .skip(_pagenum)
              .limit(30)
              .populate("user", "headimg nickname")
              .exec(function (err, workslist) {
                if (err) {
                  console.log(err);
                }
                renderWorks(res, pagecount, pagenum, workslist, _sort, _type);
              });
          }
        } else {
          if (_sort == "zan") {
            // 按 点赞 排序 （全部）
            Works.find({ tags: _type })
              .sort({ zan: -1 })
              .skip(_pagenum)
              .limit(30)
              .populate("user", "headimg nickname")
              .exec(function (err, workslist) {
                if (err) {
                  console.log(err);
                }
                renderWorks(res, pagecount, pagenum, workslist, _sort, _type);
              });
          } else {
            // 按 时间 排序 （全部）
            Works.find({ tags: _type })
              .sort({ "meta.createAt": -1 })
              .skip(_pagenum)
              .limit(30)
              .populate("user", "headimg nickname")
              .exec(function (err, workslist) {
                if (err) {
                  console.log(err);
                }
                renderWorks(res, pagecount, pagenum, workslist, _sort, _type);
              });
          }
        }
      }
    });
  } else {
    res.redirect("?page=1&type=a&sort=zan");
  }
});

/* GET works 详情页. */
router.get("/content/:page/:id", function (req, res, next) {
  let worksid = req.params.id;
  let pagenum = req.params.page;
  if (!pagenum) {
    pagenum = 1;
  }
  var reg = /^[0-9]*$/;
  if (reg.test(pagenum)) {
    let _user = req.session.user;
    if (_user) {
      res.locals.user = _user;
    }

    // WorksClassify.findOne({ ids: 0 }).exec(function (err, classify_list) {
    //   let classiftList = classify_list.tags.split("/");
    Works.find({ _id: worksid })
      .populate("user", "_id headimg nickname")
      .exec(function (err, worksdata) {
        if (worksdata && worksdata.length > 0) {
          Works.updateLooks(worksid, function (err) {
            if (err) console.log(err);
          });

          Wcomment.findCount(worksid, function (err, pagecount) {
            if (err) console.log(err);
            let _pagenum = (parseInt(pagenum) - 1) * 30;
            if (_pagenum < 0 || _pagenum > pagecount) {
              _pagenum = 0;
            }
            Wcomment.find({ works: worksid })
              .sort({ "meta.createAt": -1 })
              .skip(_pagenum)
              .limit(30)
              .populate("fromid", "headimg nickname")
              .populate("reply.fromid reply.toid", "headimg nickname")
              .exec(function (err, wcomments) {
                if (wcomments.length > 0) {
                  for (let i = 0; i < wcomments.length; i++) {
                    let replylist = wcomments[i].reply;
                    for (let ii = 0; ii < replylist.length; ii++) {
                      replylist[ii].time = moment(replylist[ii].meta.createAt)
                        .startOf("minute")
                        .fromNow();
                    }
                    wcomments[i].time = moment(wcomments[i].meta.createAt)
                      .startOf("minute")
                      .fromNow();
                  }
                }
                let _worksContent = {
                  title: worksdata[0].title + pagetitle,
                  works: worksdata[0],
                  createtime: moment(worksdata[0].meta.createAt).format("L"),
                  updatetime: moment(worksdata[0].meta.updateAt).format("L"),
                  wcomments: wcomments,
                  pagecount: pagecount,
                  compageid: pagenum,
                };
                res.render("works_content", _worksContent);
              });
          });
        } else {
          res.render("error");
        }
      });
    // });
  } else {
    res.redirect("/content/1/" + worksid);
  }
});

/* works 详情 点赞接口. */
router.post("/wcontent/wzan", function (req, res, next) {
  common.judgeUserStatus(req, res, function (req, res, next) {
    const uid = req.body.uid;
    const wid = req.body.wid;
    const zan_status = req.body.acnum;
    if (uid && wid) {
      if (zan_status == 1) {
        Works.zanAddById(wid, uid, function (err, zandata) {
          if (err) {
            console.log(err);
          }
          res.send({
            status: "success",
          });
        });
      } else {
        Works.zanReduceById(wid, uid, function (err, zandata) {
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

// 收藏接口
router.post("/wcontent/wkeep", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const uid = req.body.uid;
    const wid = req.body.wid;
    const zan_status = req.body.acnum;
    if (uid && wid) {
      if (zan_status == 1) {
        Works.keepAddById(wid, uid, function (err, zandata) {
          if (err) {
            console.log(err);
          }
          res.send({
            status: "success",
          });
        });
      } else {
        Works.keepReduceById(wid, uid, function (err, zandata) {
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

/* 评论. */
router.post("/ucomment", function (req, res, next) {
  common.judgeUserStatus(req, res, function () {
    const ucomment_msg = req.body;
    if (ucomment_msg.works && ucomment_msg.fromid && ucomment_msg.content) {
      let ucomment = new Wcomment(ucomment_msg);
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
    if (_comment.works) {
      const reply = {
        fromid: _comment.fromid,
        toid: _comment.toid,
        content: _comment.content,
      };
      Wcomment.findById(_comment.works, function (err, creply) {
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
        Wcomment.zanAddById(_zanId, myid, function (err, zandata) {
          if (err) {
            console.log(err);
          }
          res.send({
            status: "success",
          });
        });
      } else {
        Wcomment.zanReduceById(_zanId, myid, function (err, zandata) {
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
        Wcomment.szanAddById(_zanId, s_zanId, myid, function (err, zandata) {
          if (err) {
            console.log(err);
          }
          res.send({
            status: "success",
          });
        });
      } else {
        Wcomment.szanReduceById(_zanId, s_zanId, myid, function (err, zandata) {
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
