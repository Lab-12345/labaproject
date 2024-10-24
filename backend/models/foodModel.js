import mongoose from "mongoose";

// Define the schema for Food
const FoodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true }
});

// Create the model
const FoodModel = mongoose.models.Food || mongoose.model("Food", FoodSchema);

// Export the model
export default FoodModel;
