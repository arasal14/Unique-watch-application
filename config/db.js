import mongoose from "mongoose";

//Connecting to the database
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.Mongo_Url);
    console.log(
      `Successfully Connect With MongoDB Database ${connect.connection.host}`
    );
  } catch (error) {
    console.log("Error In Conneting with database");
  }
};

export default connectDB;
