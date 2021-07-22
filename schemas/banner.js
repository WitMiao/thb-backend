// 首页轮播图片表
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


var bannerSchema = new Schema({
	title:String,
	firstdetail:String,
	seconddetail:String,
	src:String,
	url:String
})

bannerSchema.statics = {
	updateBanner:function(bannerid,imgvalue, cb){
		return this
		.updateOne({_id:bannerid},{$push:{banner:imgvalue}})
		.exec(cb)
	},
	changeBanner:function(bannerid,bannerval,cb){
		return this
		.updateOne({_id:bannerid},{$set:{
			'title':bannerval.title,
			'firstdetail':bannerval.firstdetail,
			'seconddetail':bannerval.seconddetail,
			'src':bannerval.src,
			'url':bannerval.url
		}})
		.exec(cb)
	}

}
module.exports = bannerSchema;