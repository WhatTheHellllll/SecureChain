import {Product} from '../models/product.model.js';

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message: 'Error retrieving products', error});
    }
}

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
                category: product.category,
                quantity: product.quantity,
                price: product.price,
            }
        });
    } catch (error) {
        res.status(500).json({message: 'Error creating product', error});
    }
}

export {getProducts, createProduct};