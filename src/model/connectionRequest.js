const mongoose = require("mongoose");

const connectRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"UserDatatable",
    required: true,
  },
  toUserId:{    
    type: mongoose.Schema.Types.ObjectId,
    ref:"UserDatatable",
    required: true
  },
  status:{
    type:String,
    required:true,
    enum:{
        values:["interested","ignored","rejected","accepted"],
        message:`{VALUE} is invalid`
    }
}
});
connectRequestSchema.index({fromUserId:1,toUserId:1});
const ConnectRequestModel=mongoose.model("ConectRequestSchema",connectRequestSchema);
module.exports=ConnectRequestModel;