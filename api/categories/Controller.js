const { connect } = require('mongoose');
require('dotenv').config();
const { CategoryDB, CounterDB } = require('./model');

const getAllCategories = async (req, res) => {

    try {

        await connect(process.env.MONGO_URI)
        console.log("Connected")

        const allCategories = await CategoryDB.find().select({ _id: 0 })
        if (allCategories) {
            res.json({
                message: "Success",
                categories: allCategories
            })
        }
        else {
            res.json({
                message: "No categories found!"
            })
        }

    } catch (error) {
        res.json({
            message: "Error :" + error
        })
    }

}

const AddCategory = async (req, res) => {
    const { Name } = req.body;

    if (!Name) {
        res.json({
            message: "Please insert Category Name!"
        });
    } else {
        try {
            await connect(process.env.MONGO_URI);
            console.log("Connected");

            let cd = await CounterDB.findOneAndUpdate(
                { id: "autoval" },
                { "$inc": { "seq": 1 } },
                { new: true }
            );

            if (!cd) {
                const newVal = new CounterDB({ id: "autoval", seq: 1 });
                await CounterDB.create(newVal);
                console.log("Complete");
            }

            const getId = await CounterDB.findOne({ id: "autoval" });

            await CategoryDB.create({ id: getId.seq, CategoryName: Name });
            const allCategory = await CategoryDB.find().select({ _id: 0 });

            res.json({
                message: "Category added successfully!",
                Categories: allCategory
            });

        } catch (error) {
            res.json({
                message: "Error " + error
            });
        }
    }
};

const UpdateCategory = async (req, res) => {

    const { id, Name } = req.body;

    if (!id || !Name) {
        res.json({
            message: "Please Insert Category details!"
        })
    }
    else {
        try {

            const filter = { id }
            const update = { CategoryName: Name }

            await connect(process.env.MONGO_URI)
            console.log("Connected")

            const updatedCategory = await CategoryDB.findOneAndUpdate(filter, update, {
                new: true
            })

            const allCategories = await CategoryDB.find().select({ _id: 0 })

            if (updatedCategory) {
                res.status(202).json({
                    message: "Category Update Successfully Successfully!",
                    categories: allCategories
                })
            }



        } catch (error) {
            res.json({
                message: "Error :" + error
            })
        }
    }

}

const deleteCategory = async (req, res) => {

    const { CategoryName } = req.query;

    if (!CategoryName) {
        res.json({
            message: "Please Insert Category Name!"
        })
    }
    else {
        try {

            await connect(process.env.MONGO_URI)
            console.log("Connected")

            const deletedCategory = await CategoryDB.deleteOne({ CategoryName: CategoryName })
            const allCategories = await CategoryDB.find();
            res.status(200).json({
                message: "Category delete Successfully!",
                Categories: allCategories
            })


        } catch (error) {
            res.json({
                message: "Error " + error
            })
        }
    }

}

const CategoryById = async (req, res) => {

    const { CategoryName } = req.query;

    if (!CategoryName) {
        res.json({
            message: "Please Insert Category Name!"
        })
    }
    else {
        try {

            await connect(process.env.MONGO_URI)
            console.log("Connected")

            const oneCategory = await CategoryDB.findOne({ CategoryName })

            if (oneCategory) {
                res.status(200).json({
                    message: "Category found Successfully!",
                    Category: oneCategory
                })
            }
            else {
                res.status(200).json({
                    message: "Category not found!"
                })
            }

        } catch (error) {
            res.json({
                message: "Error " + error
            })
        }
    }


}


module.exports = { getAllCategories, AddCategory, UpdateCategory, deleteCategory, CategoryById }