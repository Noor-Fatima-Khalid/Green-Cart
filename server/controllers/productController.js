import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

// ADD PRODUCT

export const addProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData);
    const images = req.files;

    const imagesUrl = await Promise.all(
      images.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });

        return result.secure_url;
      })
    );

    const product = await Product.create({
      ...productData,
      images: imagesUrl,
    });

    res.json({
      success: true,
      message: "Product Added",
      product,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// GET ALL PRODUCTS
export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// GET SINGLE PRODUCT
export const productById = async (req, res) => {
  try {
    const { id } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// UPDATE STOCK
export const changeStock = async (req, res) => {
  try {
    const { id, quantity } = req.body;

    if (quantity < 0) {
      return res.json({
        success: false,
        message: "Quantity cannot be negative",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        quantity,
        inStock: quantity > 0,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Stock Updated",
      product: updatedProduct,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};