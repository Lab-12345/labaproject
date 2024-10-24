import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://laba:labakumar@cluster0.l173t.mongodb.net/project');
    console.log("db connected");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
}