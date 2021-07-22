const User = require("../models/user");
module.exports = {
  /* 判断用户状态，封禁则登出 */
  judgeUserStatus: function (req, res, func) {
    let _user = req.session.user;
    if (_user) {
      let userId = _user._id;
      User.searchStatus(userId, function (err, userinfo) {
        if (err) {
          console.log(err);
        }
        if (userinfo[0].status == -1) {
          res.send({
            status: "banned",
            msg: "你的账号已被封禁，如有疑问请联系管理员",
          });
        } else {
          func(req, res);
        }
      });
    } else {
      func(req, res);
    }
  },
};
