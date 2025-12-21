import { Product } from '../models/product.model.js';
import ErrorResponse from '../utils/error.response.js';

// @desc    Get all products
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate('lastUpdatedBy', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(
        new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
const createProduct = async (req, res, next) => {
  try {
    const { name, sku, quantity, price, category } = req.body;
    //validation
    if (!name || !sku || !category || !price || !quantity) {
      return next(new ErrorResponse('Please provide all required fields', 400));
    }
    const product = await Product.create({
      name,
      sku,
      quantity,
      price,
      category,
      lastUpdatedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Product created',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
const updateProduct = async (req, res, next) => {
  try {
    // Prepare the update data by adding the current user's ID
    const updateData = {
      ...req.body,
      lastUpdatedBy: req.user._id,
    };

    // Perform the update
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true, 
      runValidators: true,
    }).populate('lastUpdatedBy', 'name'); // Populate immediately so the frontend sees the name

    if (!product) {
      return next(
        new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return next(
        new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted',
    });
  } catch (error) {
    next(error);
  }
};

export { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
