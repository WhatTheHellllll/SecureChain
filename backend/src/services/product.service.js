import { Product } from "../models/product.model.js";
import ErrorResponse from "../utils/error.response.js";

/**
 * Get all products (populated with updater info)
 */
const getAllProducts = async () => {
  return await Product.find()
    .populate("lastUpdatedBy", "name email")
    .sort({ createdAt: -1 });
};

/**
 * Get a single product by ID
 * @param {String} id
 */
const getProductById = async (id) => {
  const product = await Product.findById(id).populate("lastUpdatedBy", "name");
  if (!product) {
    throw new ErrorResponse(`Product not found with id of ${id}`, 404);
  }
  return product;
};

/**
 * Create a new product
 * @param {Object} productData
 * @param {String} userId - ID of the user creating the product
 */
const createProduct = async (productData, userId) => {
  // Add the user to the data payload
  const payload = {
    ...productData,
    lastUpdatedBy: userId,
  };

  const product = await Product.create(payload);
  return product;
};

/**
 * Update a product
 * @param {String} id
 * @param {Object} updateData
 * @param {String} userId - ID of the user updating the product
 */
const updateProductById = async (id, updateData, userId) => {
  // Add the user to the update payload
  const payload = {
    ...updateData,
    lastUpdatedBy: userId,
  };

  const product = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate("lastUpdatedBy", "name");

  if (!product) {
    throw new ErrorResponse(`Product not found with id of ${id}`, 404);
  }

  return product;
};

/**
 * Delete a product
 * @param {String} id
 */
const softDeleteProduct = async (id) => {
  return await Product.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  softDeleteProduct,
};
