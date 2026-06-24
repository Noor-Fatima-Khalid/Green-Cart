import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import Product from "./models/Product.js";
import cloudinary from "./configs/cloudinary.js";
import { seedProducts } from "./assets/seedProducts.js";

dotenv.config({ path: "./.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const uploadImage = async (imagePath) => {
  const fullPath = path.join(__dirname, imagePath);

  const result = await cloudinary.uploader.upload(fullPath, {
    folder: "products",
  });

  return result.secure_url;
};

const seedDB = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    console.log("Old products deleted");

    console.log("Products found:", seedProducts.length);

    const formattedProducts = await Promise.all(
      seedProducts.map(async (p) => {
        const uploadedImages = await Promise.all(
          p.images.map((imgPath) => uploadImage(imgPath))
        );

        return {
          name: p.name,
          description: p.description,
          price: p.price,
          offerPrice: p.offerPrice,
          images: uploadedImages,
          category: p.category,
          quantity: 10,
          inStock: p.inStock ?? true,
        };
      })
    );

    await Product.insertMany(formattedProducts);

    console.log("✅ All products inserted successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

seedDB();