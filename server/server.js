import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
// import { stripeWebhooks } from './controllers/orderController.js';
import dotenv from "dotenv";

dotenv.config();

const app = express();

console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("NODE_ENV:", process.env.NODE_ENV);

const port = process.env.PORT || 8000;

await connectDB();
// await connectCloudinary();

const allowedOrigins = [
    'http://localhost:5173',
    'https://green-cart-n3ej.vercel.app'
];

// Proper CORS middleware
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.get('/', (req, res) => res.send('API is working!'));

app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

app.listen(port, () => {
    console.log(`PORT connected on ${port}`);
});