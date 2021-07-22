//  用户关注人表
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var ufollSchema = new Schema({
	userid: {type:ObjectId, ref:'User'},
	follist:[{
		toid: {type:ObjectId, ref:'User'}
	}],
	fanslist:[{
		toid: {type:ObjectId, ref:'User'}
	}],
	fanstotal: {
		type:Number,
		default:0
	},
	folltotal: {
		type:Number,
		default:0
	},
	createAt: {
		type:Date,
		default: Date.now()
	}
})

ufollSchema.statics = {
	findById:function(userid, cb) {
		return this
		.find({userid: userid})
		.exec(cb)
	},
	fansAddById: function(id, fansid, cb){
		return this
		.updateOne({userid:id},{$inc:{fanstotal:1},$push:{fanslist:fansid}})
		.exec(cb)
	},
	fansReduceById:function(id, fansid, cb){
		return this
		.updateOne({userid:id},{$inc:{fanstotal:-1},$pull:{fanslist:{toid:fansid}}})
		.exec(cb)
	},
	follAddById: function(id, follvalue, cb){
		return this
		.updateOne({userid:id},{$inc:{folltotal:1},$push:{follist:follvalue}})
		.exec(cb)
	},
	follReduceById:function(id, follerid, cb){
		return this
		.updateOne({userid:id},{$inc:{folltotal:-1},$pull:{follist:{toid:follerid}}})
		.exec(cb)
	}
}
module.exports = ufollSchema;