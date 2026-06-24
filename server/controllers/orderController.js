import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

// ❌ Stripe disabled (mock system used instead)
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// PLACE ORDER - COD
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, address, items } = req.body;

        if (!address || !items || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" });
        }

        // FIXED TOTAL CALCULATION
        let amount = 0;

        for (let item of items) {
            const product = await Product.findById(item.product);
            amount += product.offerPrice * item.quantity;
        }

        amount += Math.floor(amount * 0.02); // tax

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
            isPaid: false
        });

        return res.json({
            success: true,
            message: "Order placed successfully (COD)"
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


// MOCK ONLINE PAYMENT (REPLACES STRIPE)
export const placeOrderMock = async (req, res) => {
    try {
        const userId = req.userId;
        const { address, items } = req.body;

        if (!address || !items || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" });
        }

        let amount = 0;

        for (let item of items) {
            const product = await Product.findById(item.product);
            amount += product.offerPrice * item.quantity;
        }

        amount += Math.floor(amount * 0.02); // tax

        const transactionId = "MOCK_" + Date.now();

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online (Mock)",
            isPaid: true,
            transactionId
        });

        // clear cart
        await User.findByIdAndUpdate(userId, { cartItems: {} });

        return res.json({
            success: true,
            message: "Payment successful (Mock)",
            transactionId,
            order
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// GET USER ORDERS
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;

        const orders = await Order.find({ userId })
            .populate("items.product address")
            .sort({ createdAt: -1 });

        res.json({ success: true, orders });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


// GET ALL ORDERS (ADMIN/SELLER)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("items.product address")
            .sort({ createdAt: -1 });

        res.json({ success: true, orders });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};