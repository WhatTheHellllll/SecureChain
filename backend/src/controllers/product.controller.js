import productService from "../services/product.service.js";

/**
 * @desc    Get all products
 * @route   GET /api/v1/products
 * @access  Public (or Private, depending on your app)
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
 * @param   {string} req.params.id - The Object ID of the product
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
 * @param   {string} req.body.name - Name of product
 * @param   {string} req.body.sku - Stock Keeping Unit code
 * @param   {number} req.body.price - Price of product
 * @param   {number} req.body.quantity - Inventory count
 * @param   {string} req.body.category - Category string
 */
const createProduct = async (req, res, next) => {
  try {
    // Service handles creation. We pass req.user._id to track who made it.
    const product = await productService.createProduct(req.body, req.user._id);

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
 * @param   {string} [req.body.name] - Updated name
 * @param   {number} [req.body.price] - Updated price
 */
const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProductById(
      req.params.id,
      req.body,
      req.user._id // Track who updated it
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
 * @desc    Delete product
 * @route   DELETE /api/v1/products/:id
 * @access  Private (Admin)
 */
const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProductById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    next(error);
  }
};

export { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
