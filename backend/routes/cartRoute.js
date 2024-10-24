import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { addToCart, getCart, removeFromCart } from '../controllers/cartCrontroller.js';
// Fixed typo in the import statement

const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.post("/remove", authMiddleware, removeFromCart);
cartRouter.post("/get", authMiddleware, getCart);

export default cartRouter;
