import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads"); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Add timestamp to avoid filename collisions
    }
});

// Initialize multer with the defined storage
const upload = multer({ storage: storage });

// Define routes
foodRouter.post("/add", upload.single("images"), addFood); // Route to add food with image upload
foodRouter.get("/list", listFood); // Route to list all food items
foodRouter.delete("/remove/:id", removeFood); // Route to remove food by ID, using DELETE method

export default foodRouter;
