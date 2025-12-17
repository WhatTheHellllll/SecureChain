import {Product} from '../models/product.model.js';

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message: 'Error retrieving products', error});
    }
}

const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, sku, quantity, price, category, lastUpdatedBy } = req.body;

        //validation
        if (!name || !sku || !category || !price || !quantity) {
            return res.status(400).json({message: 'Name, SKU, price , quantity and Category are required'});
        }

        const product = await Product.create({
            name : name.trim().toLowerCase(),
            sku,
            quantity,
            price,
            category : category.trim().toLowerCase(),
            lastUpdatedBy
        });

        
        res.status(201).json({
            message: 'Product created successfully',
            product: {
                name: product.name,
                quantity: product.quantity,
                price: product.price,
            }
        });
    } catch (error) {
        res.status(500).json({message: 'Error creating product', error: error.message});
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params; // Get ID from URL
        const product = await Product.findByIdAndUpdate(id, req.body, {
            new: true, // Return the updated product, not the old one
            runValidators: true // Enforce schema rules (like required fields)
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ 
            message: "Product updated successfully", 
            product :{
                name: product.name,
                quantity: product.quantity,
                price: product.price,
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error : error.message });
    }
};

export {getProducts,getProduct, createProduct, updateProduct, deleteProduct};