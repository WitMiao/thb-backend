// 首页轮播评论表
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


var icommentSchema = new Schema({
	content:String,
	enname:String,
	name:String
})

icommentSchema.statics = {
	updateIcomment:function(icommentid,icommentval, cb){
		return this
		.updateOne({_id:icommentid},{$push:{icomment:icommentval}})
		.exec(cb)
	},
	changeIcomment:function(icommentid,icommentval,cb){
		return this
		.updateOne({_id:icommentid},{$set:{
			'content':icommentval.content,
			'enname':icommentval.enname,
			'name':icommentval.name
		}})
		.exec(cb)
	}

}
module.exports = icommentSchema;