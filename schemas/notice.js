// 消息表
var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var noticeSchema = new Schema({
	user: {type:ObjectId, ref:'User'},
	message:[{
		title:String,
		content:String,
		createAt:String,
	}],
	nstatus:{
		type:Number,
		default:0
	},
	ustatus:{
		type:Number,
		default:0
	},
	meta:{
		createAt: {
			type:Date,
			default: Date.now()
		}
	}
})

noticeSchema.statics = {
	findById:function(userid,cb){
		return this
		.find({user: userid})
		.exec(cb)
	},
	updateNotice:function(userid,noticemsg, cb){
		return this
		.updateOne({user: userid},{$push:{message:{$each:[noticemsg],$position:0}}})
		.exec(cb)
	},
	tsAll:function(noticemsg, cb){
		return this
		.updateMany({ustatus: 0},{$push:{message:{$each:[noticemsg],$position:0}}},{ multi: true })
		.exec(cb)
	},
	deleteOne:function(nid,uid, cb){
		return this
		.updateOne({user: uid},{$pull:{message:{_id:nid}}})
		.exec(cb)
	},
	deleteAll:function(uid, cb){
		return this
		.updateOne({user: uid},{$set:{message:[]}})
		.exec(cb)
	}
}
module.exports = noticeSchema