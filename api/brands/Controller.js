const { connect } = require('mongoose');
require('dotenv').config();
const { brandDB, BrandCount } = require('./model');

const AddBrand = async (req, res) => {

    const { BrandName, BrandImage, Category } = req.body;

    if (!BrandName || !BrandImage || !Category) {
        res.json({
            message: "Please Insert Proper Values!"
        })
    }
    else {
        try {

            await connect(process.env.MONGO_URI)
            console.log("Connected")

            let cd = await BrandCount.findOneAndUpdate(
                { id: "autoval" },
                { "$inc": { "seq": 1 } },
                { new: true }
            );

            if (!cd) {
                const newVal = new BrandCount({ id: "autoval", seq: 1 });
                await BrandCount.create(newVal);
                console.log("Complete");
            }

            const getId = await BrandCount.findOne({ id: "autoval" });

            await brandDB.create({ id: getId.seq, BrandName, BrandImage, Category })
            const allBrands = await brandDB.find().select({_id : 0})

            res.status(201).json({
                message: "Brand Add Successfully!",
                brands: allBrands
            })

        } catch (error) {
            res.json({
                message: "Error " + error
            })
        }
    }
}

const brandById = async (req, res) => {

    const { brandId } = req.query;

    if (!brandId) {
        res.json({
            message: "Please Insert Brand Id!"
        })
    }
    else {
        try {

            await connect(process.env.MONGO_URI)
            console.log("Connected")

            const oneBrand = await brandDB.findOne({ id: brandId })

            if (oneBrand) {
                res.status(200).json({
                    message: "Brand found Successfully!",
                    brand: oneBrand
                })
            }
            else {
                res.status(200).json({
                    message: "Brand not found!"
                })
            }

        } catch (error) {
            res.json({
                message: "Error " + error
            })
        }
    }


}

const getAllBrands = async (req, res) => {
    try {

        await connect(process.env.MONGO_URI)
        console.log("Connected")

        const allBrands = await brandDB.find()

        if (allBrands) {
            res.status(200).json({
                brands: allBrands
            })
        }
        else {
            res.status(404).json({
                message: "No brand found!"
            })
        }


    } catch (error) {
        res.json({
            message: "Error " + error
        })
    }
}

const updateBrand = async (req, res) => {

    const { id, Name, Image, Category } = req.body;

    if (!id || !Name || !Image || !Category) {
        res.json({
            message: "Please Insert Brand details!"
        })
    }
    else {
        try {

            const filter = { id };
            const update = { BrandName: Name, BrandImage: Image, Category }

            await connect(process.env.MONGO_URI)
            console.log("Connected")

            const updatedBrand = await brandDB.findOneAndUpdate(filter, update, {
                new: true
            });

            const allBrands = await brandDB.find();

            if (updatedBrand) {
                res.status(202).json({
                    message: "Brand Update Successfully Successfully!",
                    brands: allBrands
                })
            }

        } catch (error) {
            res.json({
                message: "Error " + error
            })
        }
    }

}

const deleteBrand = async (req, res) => {

    const { BrandName } = req.query;

    if (!BrandName) {
        res.json({
            message: "Please Insert Brand Name!"
        })
    }
    else {
        try {

            await connect(process.env.MONGO_URI)
            console.log("Connected")

            const deletedBrand = await brandDB.deleteOne({ BrandName: BrandName })
            const allBrands = await brandDB.find();
            res.status(200).json({
                message: "Brand delete Successfully!",
                brands: allBrands
            })


        } catch (error) {
            res.json({
                message: "Error " + error
            })
        }
    }

}

module.exports = { AddBrand, brandById, getAllBrands, updateBrand, deleteBrand }