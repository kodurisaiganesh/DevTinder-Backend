const mongoose=require('mongoose');
const ConnectDb=async function(){
await mongoose.connect("mongodb+srv://ganeshsai0828_db_user:Sai%4067890@namasthenode.tqtiano.mongodb.net/DevTinderr")
}

module.exports={ConnectDb};