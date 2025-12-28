import mongoose from "mongoose";
const connectdb = async()=>{
try{
   await mongoose.connect(process.env.MONGOURI);
   console.log(`MongoDB connected successfully`);
}
catch(err){
   console.log(`Connection Failed ${err}`);
   process.exit(1);
}
}
export default connectdb;