import  jwt  from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Adjust to get token from Bearer
    if (!token) {
        return res.json({ success: false, message: 'Not Authorized, login again' });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Invalid token' }); // More specific error message
    }
};


export default authMiddleware;