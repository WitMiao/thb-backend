//  用户表
var mongoose = require("mongoose");
var userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    require: true,
  },
  nickname: String,
  password: {
    type: String,
    require: true,
  },
  email: String,
  realname: String,
  headimg: String,
  phoneNum: String,
  qq: String,
  wx: String,
  motto: String,
  token: String,
  noticenum: {
    type: Number,
    default: 0,
  },
  status: {
    type: Number,
    default: 0,
  },
  isteacher: {
    type: Number,
    default: 0,
  },
  isstudent: {
    type: Number,
    default: 0,
  },
  
  meta: {
    createAt: {
      type: Date,
      default: Date.now(),
    },
    updateAt: {
      type: Date,
      default: Date.now(),
    },
  },
});
userSchema.pre("save", function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }
  next();
});
userSchema.statics = {
  fetch: function (cb) {
    return this.find({}).exec(cb);
  },
  searchStatus: function (userid, cb) {
    return this.find({ _id: userid }, { status: 1, _id: 0 }).exec(cb);
  },
  fetchByName: function (username, cb) {
    return this.find({ username: username }).exec(cb);
  },
  fetchById: function (userid, cb) {
    return this.find({ _id: userid }).exec(cb);
  },
  updateById: function (updatemsg, cb) {
    return this.updateOne(
      { _id: updatemsg._id },
      {
        $set: {
          nickname: updatemsg.nickname,
          email: updatemsg.email,
          realname: updatemsg.realname,
          headimg: updatemsg.headimg,
          phoneNum: updatemsg.phoneNum,
          qq: updatemsg.qq,
          wx: updatemsg.wx,
          motto: updatemsg.motto,
        },
      }
    ).exec(cb);
  },
  updateNoticenum: function (userid, cb) {
    return this.updateOne({ _id: userid }, { $set: { noticenum: 0 } }).exec(cb);
  },
  updateAllnotice: function (cb) {
    return this.updateMany(
      { status: 0 },
      { $inc: { noticenum: 1 } },
      { multi: true }
    ).exec(cb);
  },
  updateOnenotice: function (userid, cb) {
    return this.updateOne({ _id: userid }, { $inc: { noticenum: 1 } }).exec(cb);
  },
};
module.exports = userSchema;
