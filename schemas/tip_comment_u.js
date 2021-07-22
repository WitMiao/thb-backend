// 举报 用户主页评论表
let mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
// comid 是回复的id
let ucommentipSchema = new Schema({
	fromid: {type:ObjectId, ref:'User'},
	toid: {type:ObjectId, ref:'Ucomment'},
	comid: String,
	content:String,
	diff:String,
	status:{
		type:Number,
		default:0
	},
	createAt:String,
	meta:{
		createAt: {
			type:Date,
			default: Date.now()
		}
	}
})

ucommentipSchema.statics = {
	removeById:function(id, cb){
		return this
		.deleteOne({_id: id})
		.exec(cb)
	},
	updateStatus:function(id, _status, cb){
		return this
		.updateOne({_id:id},{$set:{status:_status}})
		.exec(cb)
	}
}
module.exports = ucommentipSchema