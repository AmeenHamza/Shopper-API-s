const nodemailer = require("nodemailer");
require('dotenv').config()
var Mailgen = require('mailgen');
const { connect, get } = require("mongoose");
const { orderDB, orderCount } = require('./model');

const getOrders = async (req, res) => {

    try {

        await connect(process.env.MONGO_URI)
        console.log("Connected")

        const orders = await orderDB.find();

        if (orders) {

            res.status(200).json({
                message: "success",
                orders: orders
            })

        }
        else {
            res.status(404).json({
                message: "No order found!"
            })
        }

    } catch (error) {
        res.json({
            message: "Error :" + error
        })
    }

}

const confirmOrder = async (req, res) => {

    const { email, customerName } = req.body;

    if (!email || !customerName) {
        res.status(403).json({
            message: "Please provide email"
        })
    }
    else {

        const config = {
            service: "gmail",
            auth: {
                // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASS,
            },
        }

        console.log("Run")

        const transporter = nodemailer.createTransport(config);

        //    Mailgen Starts

        var mailGenerator = new Mailgen({
            theme: 'default',
            order: {
                // Appears in header & footer of e-mails
                name: 'Shopper Mart',
                link: 'https://shoper-ecommerce.netlify.app/',
                // Optional order logo
                logo: 'https://download.logo.wine/logo/Shoppers_Drug_Mart/Shoppers_Drug_Mart-Logo.wine.png'
            }
        });

        var mailgenEmail = {
            body: {
                name: customerName,
                intro: 'Welcome to Shopper Mart! We\'re very excited to have you on board.',
                table: {
                    data: [
                        {
                            name: customerName,
                            email: email,
                            token: "12345"
                        }
                    ]
                },
            }
        };

        //    Mailgen ends

        const response = {
            from: process.env.NODEMAILER_EMAIL, // sender address
            to: email, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: mailGenerator.generate(mailgenEmail), // html body
        }

        try {
            console.log("first")

            await transporter.sendMail(response);
            res.status(200).json({
                message: "Check you email " + email
            })

        } catch (error) {
            res.status(500).json({
                message: "Error :" + error
            })
        }


    }

}

const addOrders = async (req, res) => {

    const { customerEmail, items, totalBill, customerAddresss, customerContact, customerName, status } = req.body;

    if (!customerEmail || !items || !totalBill || !customerAddresss || !customerContact || !customerName) {
        res.status(403).json({
            message: "Invalid Credentials"
        })
    }
    else {

        try {

            await connect(process.env.MONGO_URI)
            console.log("Connected")

            let cd = await orderCount.findOneAndUpdate(
                { id: "autoval" },
                { "$inc": { "seq": 1 } },
                { new: true }
            );

            if (!cd) {
                const newVal = new orderCount({ id: "autoval", seq: 1 });
                await orderCount.create(newVal);
                console.log("Complete");
            }

            const getId = await orderCount.findOne({ id: "autoval" });

            const order = await orderDB.create({ id: getId.seq, customerEmail, items, totalBill, customerAddresss, customerContact, customerName, status })

            // Now the time is to send customerEmail of confirmation with details

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.NODEMAILER_EMAIL,
                    pass: process.env.NODEMAILER_PASS,
                },
            });

            // Melgen Setup

            var mailGenerator = new Mailgen({
                theme: 'default',
                order: {
                    // Appears in header & footer of e-mails
                    name: 'Shopper Mart',
                    link: 'https://shoper-ecommerce.netlify.app/',
                    // Optional order logo
                    logo: 'https://download.logo.wine/logo/Shoppers_Drug_Mart/Shoppers_Drug_Mart-Logo.wine.png'
                }
            });

            await transporter.sendMail({
                from: process.env.NODEMAILER_EMAIL, // sender address
                to: customerEmail, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: mailGenerator.generate({
                    body: {
                        name: customerName,
                        intro: 'Welcome to Shopper Mart! We\'re very excited to have you on board.',
                        table: {
                            data: [
                                {
                                    name: customerName,
                                    email: customerEmail,
                                    token: order._id,
                                    date: order.order_at,
                                    Address: customerAddresss,
                                    contact: customerContact
                                },
                                {
                                    items: items.map((val) => val)
                                }
                            ]
                        },
                        outro: "Thankyou! for choosing Shopper, please don't forget to share feedback"
                    }
                }), // html body
            });

            if (order) {
                res.status(201).json({
                    message: "Order placed Successfully!",
                    tracking_id: order._id
                })
            }



        } catch (error) {
            res.json({
                message: "Error :" + error
            })
        }

    }

}

const updateOrder = async (req, res) => {

    const { _id, customerName, order_at, status, customerEmail, customerAddress, customerContact } = req.body;

    if (!_id || !customerName || !order_at || !status || !customerEmail || !customerAddress || !customerContact) {
        res.json({
            message: "Please Insert order details"
        })
    }
    else {
        try {
            const filter = { _id }
            const update = { customerName, order_at, status, customerEmail, customerAddress, customerContact }

            await connect(process.env.MONGO_URI)
            console.log("Connected")

            const updatedOrder = await orderDB.findOneAndUpdate(filter, update, {
                new: true
            })

            const allOrders = await orderDB.find()
            if (updatedOrder) {
                res.status(202).json({
                    message: "Order updated successfully",
                    orders: allOrders
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

const orderById = async (req, res) => {

    const { _id } = req.query;

    if (!_id) {
        res.json({
            message: "Please provide a order tracking id"
        })
    }
    else {
        try {

            await connect(process.env.MONGO_URI)
            console.log("Connected")

            const oneOrder = await orderDB.findOne({ _id })

            if (oneOrder) {
                res.status(200).json({
                    message: "Order found Successfully!",
                    order: oneOrder
                })
            }
            else {
                res.status(200).json({
                    message: "Order not found!"
                })
            }

        } catch (error) {
            res.json({
                message: "Error " + error
            })
        }
    }

}

const deleteOrder = async (req, res) => {

    const { _id } = req.query;

    if (!_id) {
        res.json({
            message: "Please Insert Order ID!"
        })
    }
    else {
        try {

            await connect(process.env.MONGO_URI)
            console.log("Connected")

            const deletedOrder = await orderDB.deleteOne({ _id })
            const allOrders = await orderDB.find();

            if (deletedOrder) {
                res.status(200).json({
                    message: "Order delete Successfully!",
                    orders: allOrders
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

module.exports = { getOrders, confirmOrder, addOrders, updateOrder, orderById, deleteOrder }