import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import cloudinary from "../configs/cloudinary.js";
import Product from "../models/Product.js";
import { seedProducts } from "../assets/seedProducts.js";

dotenv.config();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB connected");

// Upload one image to Cloudinary
const uploadImage = async (imagePath) => {
  const fullPath = path.join(__dirname, "..", imagePath);

  const result = await cloudinary.uploader.upload(fullPath, {
    folder: "products",
  });

  return result.secure_url;
};

const uploadProducts = async () => {
  try {
    // clear old products
    await Product.deleteMany();

    const formattedProducts = await Promise.all(
      seedProducts.map(async (product) => {
        const uploadedImages = await Promise.all(
          product.images.map(async (imgPath) => {
            return await uploadImage(imgPath);
          })
        );

        return {
          name: product.name,
          description: product.description,
          price: product.price,
          offerPrice: product.offerPrice,
          images: uploadedImages, // Cloudinary URLs
          category: product.category,
          quantity: 10,
          inStock: product.inStock,
        };
      })
    );

    await Product.insertMany(formattedProducts);

    console.log("✅ Products uploaded and saved");
    process.exit();
  } catch (error) {
    console.log("❌ Bulk upload error:", error.message);
    process.exit(1);
  }
};

uploadProducts();