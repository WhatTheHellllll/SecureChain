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
 * Creates a new product and logs the action
 * @param {Object} productData - The product details (name, sku, price, etc.)
 * @param {string} userId - The MongoDB ObjectId of the user creating the product
 * @param {Object} req - The Express Request object (needed for IP/UserAgent in Audit Log)
 * @returns {Promise<Object>} The created product document
 */
const createProduct = async (productData, userId, req) => {
  const payload = {
    ...productData,
    lastUpdatedBy: userId,
    isActive: true,
  };

  const product = await Product.create(payload);

  // RECORD THE AUDIT LOG
  // We do this after creation so we have the real product._id
  await auditService.log({
    action: "CREATE",
    entityType: "Product",
    entityId: product._id,
    performedBy: userId,
    req: req,
    oldValue: null,
    newValue: product.toObject(),
  });

  return product;
};

/**
 * Updates a product by ID and records changes in Audit Log
 * @param {string} id - The product ID to update
 * @param {Object} updateData - Object containing fields to update
 * @param {string} userId - The ID of the user performing the update
 * @param {Object} req - The Express Request object
 * @returns {Promise<Object>} The updated product document
 * @throws {ErrorResponse} 404 if product not found
 */
const updateProductById = async (id, updateData, userId, req) => {
  // Add the user to the update payload
  const product = await Product.findById(id);
  if (!product) {
    throw new ErrorResponse(`Product not found with id of ${id}`, 404);
  }
  // Capture what it looked like BEFORE the update
  const oldValue = product.toObject();

  // Apply the new data
  Object.keys(updateData).forEach((key) => {
    product[key] = updateData[key];
  });
  product.lastUpdatedBy = userId;

  // Save to database
  await product.save();

  // LOG THE ACTION
  await auditService.log({
    action: "UPDATE",
    entityType: "Product",
    entityId: product._id,
    performedBy: userId,
    req: req,
    oldValue: oldValue,
    newValue: product.toObject(),
  });

  return product;
};

/**
 * Soft deletes a product (sets isActive: false)
 * @param {string} id - The product ID to archive
 * @param {string} userId - The ID of the user performing the delete
 * @param {Object} req - The Express Request object
 * @returns {Promise<Object>} The archived product document
 */
const softDeleteProduct = async (id, userId, req) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new ErrorResponse("Product not found", 404);
  }

  // Capture old state for audit
  const oldValue = {
    isActive: product.isActive ?? true,
    deletedAt: product.deletedAt || null,
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
