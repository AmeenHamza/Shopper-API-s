const { connect } = require('mongoose');
require('dotenv').config();
const { productDB, productCount } = require('./model');

const getProducts = async (req, res) => {

    try {

        await connect(process.env.MONGO_URI)
        console.log("Connected")

        const allProducts = await productDB.find().select({ _id: 0 })
        if (allProducts) {
            res.status(200).json({
                message: 'Success',
                products: allProducts
            })
        }
        else {
            res.status(404).json({
                message: "No product Found"
            })
        }

    } catch (error) {
        res.json({
            message: "Error :" + error
        })
    }

}

const addProduct = async (req, res) => {

    const { title, price, description, category, image, rating } = req.body;

    if (!title || !price || !description || !category || !image || !rating) {
        res.json({
            message: "Please Insert Proper Values!"
        })
    }
    else {
        try {

            await connect(process.env.MONGO_URI)
            console.log("Connected")

            let cd = await productCount.findOneAndUpdate(
                { id: "autoval" },
                { "$inc": { "seq": 1 } },
                { new: true }
            );

            if (!cd) {
                const newVal = new productCount({ id: "autoval", seq: 1 });
                await productCount.create(newVal);
                console.log("Complete");
            }

            const getId = await productCount.findOne({ id: "autoval" });

            await productDB.create({ id: getId.seq, title, price, description, category, image, rating })
            const allProducts = await productDB.find().select({ _id: 0 })

            res.status(201).json({
                message: "Product Add Successfully!",
                products: allProducts
            })

        } catch (error) {
            res.json({
                message: "Error " + error
            })
        }
    }
}

const productByName = async (req, res) => {

    const { title } = req.query;

    if (!title) {
        res.json({
            message: "Please provide a name of product"
        })
    }
    else {
        try {

            await connect(process.env.MONGO_URI)
            console.log("Connected")

            const oneProduct = await productDB.findOne({ title: title }).select({ _id: 0 })

            if (oneProduct) {
                res.status(200).json({
                    message: "Product found Successfully!",
                    product: oneProduct
                })
            }
            else {
                res.status(200).json({
                    message: "Product not found!"
                })
            }

        } catch (error) {
            res.json({
                message: "Error " + error
            })
        }
    }

}

const updateProduct = async (req, res) => {

    const { id, title, price, description, category, image, rating } = req.body;

    if (!title || !price || !description || !category || !image || !rating) {
        res.json({
            message: "Please Insert product details"
        })
    }
    else {
        try {
            const filter = { id }
            const update = { title, price, description, category, image, rating }

            await connect(process.env.MONGO_URI)
            console.log("Connected")

            const updatedProduct = await productDB.findOneAndUpdate(filter, update, {
                new: true
            })

            const allProducts = await productDB.find().select({ _id: 0 })
            if (updateProduct) {
                res.status(202).json({
                    message: "Product updated successfully",
                    products: allProducts
                })
            }
            else {
                res.json({
                    message: "Something went wrong"
                })
            }
        } catch (error) {
            res.json({
                message: "Error :" + error
            })
        }
    }

}

const deleteProduct = async (req, res) => {

    const { id } = req.query;

    if (!id) {
        res.json({
            message: "Please Insert Product ID!"
        })
    }
    else {
        try {

            await connect(process.env.MONGO_URI)
            console.log("Connected")

            const deletedProduct = await productDB.deleteOne({ id })
            const allProducts = await productDB.find();

            if (deleteProduct) {
                res.status(200).json({
                    message: "Product delete Successfully!",
                    products: allProducts
                })
            }
            else {
                res.status({
                    message: "Something went wrong"
                })
            }


        } catch (error) {
            res.json({
                message: "Error " + error
            })
        }
    }

}

const byCategory = async (req, res) => {

    const { category } = req.query;

    if (!category) {
        res.json({
            message: "Please provide a category name"
        })
    }

    else {
        try {

            await connect(process.env.MONGO_URI)
            console.log("Connected")

            const byCategory = await productDB.find({ category })
            if (byCategory) {
                res.json({
                    message : "Products found",
                    products : byCategory
                })
            }
            else {
                res.json({
                    message : "No product found with name of this category"
                })
            }

        } catch (error) {

        }
    }

}

module.exports = { getProducts, addProduct, updateProduct, deleteProduct, productByName, byCategory }