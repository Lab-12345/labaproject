import foodModel from "../models/foodModel.js";
import fs from 'fs-extra';

const addFood = async (req, res) => {
    try {
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file uploaded" });
        }

        // Assign filename for the image
        let image_filename = req.file.filename;  // No need for template literal here

        // Create a new food item with data from the request body
        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,  // corrected spelling
            image: image_filename
        });

        // Save the new food item to the database
        await food.save();

        // Send success response
        res.status(201).json({ success: true, message: "Food added successfully" });
    } catch (error) {
        console.error(error);

        // Send error response with status 500 (server error)
        res.status(500).json({ success: false, message: "Error adding food", error: error.message });
    }
};

const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.error(error);  // Changed to console.error for consistency
        res.status(500).json({ success: false, message: "Error retrieving food items", error: error.message }); // Improved error message
    }
};

const removeFood = async (req,res)=>{
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:'Food Removed'})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:'Error'})
    }
}


export { addFood, listFood, removeFood };