import productService from "../services/product.service.js";

/**
 * @desc    Get all products
 * @route   GET /api/v1/products
 * @access  Public
 * @param   {import("express").Request} req
 * @param   {import("express").Response} res
 * @param   {import("express").NextFunction} next
 */
const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product
 * @route   GET /api/v1/products/:id
 * @access  Public
 * @param   {import("express").Request} req
 * @param   {import("express").Response} res
 * @param   {import("express").NextFunction} next
 */
const getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new product
 * @route   POST /api/v1/products
 * @access  Private (Admin/Manager)
 * @param   {import("express").Request} req
 * @param   {import("express").Response} res
 * @param   {import("express").NextFunction} next
 */
const createProduct = async (req, res, next) => {
  try {
    // FIX: Pass 'req' as the 3rd argument for Audit Logging
    const product = await productService.createProduct(
      req.body,
      req.user._id,
      req
    );

    res.status(201).json({
      success: true,
      message: "Product created",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/v1/products/:id
 * @access  Private (Admin/Manager)
 * @param   {import("express").Request} req
 * @param   {import("express").Response} res
 * @param   {import("express").NextFunction} next
 */
const updateProduct = async (req, res, next) => {
  try {
    // FIX: Pass 'req' as the 4th argument for Audit Logging
    const product = await productService.updateProductById(
      req.params.id,
      req.body,
      req.user._id, // Track who updated it
      req // Audit Log needs this
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete product (Soft Delete)
 * @route   DELETE /api/v1/products/:id
 * @access  Private (Admin)
 * @param   {import("express").Request} req
 * @param   {import("express").Response} res
 * @param   {import("express").NextFunction} next
 */
const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;

    // This one was already correct!
    const product = await productService.softDeleteProduct(
      productId,
      req.user._id,
      req
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product deactivated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
