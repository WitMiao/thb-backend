//  用户评论表
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


var ucommentSchema = new Schema({
	user: {type:ObjectId, ref:'User'},
	fromid: {type:ObjectId, ref:'User'},
	reply:[{
		fromid: {type:ObjectId, ref:'User'},
		toid: {type:ObjectId, ref:'User'},
		content: String,
		zan:{
			type:Number,
			default:0
		},
		zanlist:Array,
		time:String,
		meta:{
			createAt: {
				type:Date,
				default: Date.now()
			}
		}
	}],
	content: String,
	zan:{
		type:Number,
		default:0
	},
	zanlist:Array,
	time:String,
	meta:{
		createAt: {
			type:Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})
ucommentSchema.pre('save', function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next();
})
ucommentSchema.statics = {
	fetch:function(cb){
		return this
		.find({})
		.exec(cb)
	},
	findById:function(userid, cb) {
		return this
		.find({_id: userid})
		.exec(cb)
	},
	zanAddById: function(id, zanvalue, cb){
		return this
		.updateOne({_id:id},{$inc:{zan:1},$push:{zanlist:zanvalue}})
		.exec(cb)
	},
	zanReduceById:function(id, zanvalue, cb){
		return this
		.updateOne({_id:id},{$inc:{zan:-1},$pull:{zanlist:zanvalue}})
		.exec(cb)
	},
	szanAddById: function(id, replyid, zanvalue, cb){
		return this
		.updateOne({_id:id,'reply._id':replyid},{$inc:{'reply.$.zan':1},$push:{'reply.$.zanlist':zanvalue}})
		.exec(cb)
	},
	szanReduceById:function(id, replyid, zanvalue, cb){
		return this
		.updateOne({_id:id,'reply._id':replyid},{$inc:{'reply.$.zan':-1},$pull:{'reply.$.zanlist':zanvalue}})
		.exec(cb)
	},
	findCount:function(userid, cb){
		return this
		.find({user: userid}).countDocuments()
		.exec(cb)
	},
	deleteFById:function(cid, cb){
		return this
		.deleteOne({_id: cid})
		.exec(cb)
	},
	deleteSById:function(cid,tid, cb){
		return this
		.updateOne({_id: cid,'reply._id':tid},{$pull:{reply:{_id:tid}}})
		.exec(cb)
	}
}
module.exports = ucommentSchema;