import { Product } from "../models/product.model.js";
import ErrorResponse from "../utils/error.response.js";
import auditService from "./audit.service.js";
/**
 * Get all products (populated with updater info)
 */
const getAllProducts = async () => {
  return await Product.find({ isActive: true })
    .populate("lastUpdatedBy", "name email")
    .sort({ createdAt: -1 });
};

/**
 * Get a single product by ID
 * @param {String} id
 */
const getProductById = async (id) => {
  const product = await Product.findOne({ _id: id, isActive: true }).populate(
    "lastUpdatedBy",
    "name"
  );
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
const softDeleteProduct = async (id, userId, req) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new ErrorResponse("Product not found", 404);
  }

  // Capture old state for audit
  const oldValue = {
    isActive: product.isActive,
    deletedAt: product.deletedAt,
  };

  product.isActive = false;
  product.deletedAt = Date.now();
  product.lastUpdatedBy = userId;
  await product.save();

  // RECORD THE AUDIT LOG
  await auditService.log({
    action: "DELETE",
    entityType: "Product",
    entityId: product._id,
    performedBy: userId,
    oldValue: oldValue,
    newValue: { isActive: false, deletedAt: product.deletedAt },
    req: req, // Pass request for IP/UserAgent
  });

  return product;
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  softDeleteProduct,
};
