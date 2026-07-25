import mongoose, { Schema, models } from "mongoose";

// The { strict: false } flag tells Mongoose to mind its own business 
// and just fetch exactly whatever you built in the database.
const questionSchema = new Schema({}, { 
  strict: false, 
  collection: 'questions' 
});

const Question = models.Question || mongoose.model("Question", questionSchema);

export default Question;