require('dotenv').config()
const userDB = require('./model');
const { connect } = require('mongoose')
const { hash, compare } = require('bcryptjs')
const { sign } = require('jsonwebtoken')

// Get All Users
const getAllUsers = async (req, res) => {

    try {

        await connect(process.env.MONGO_URI)
        console.log("Connected")

        const allUsers = await userDB.find()
        if (allUsers) {
            res.status(200).json({
                users: allUsers,
                message: "Success"
            })
        }
        else {
            res.status(400).json({
                message: "No user found"
            })
        }

    } catch (error) {
        res.json({
            message: "Error :" + error
        })
    }

}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {

        await connect(process.env.MONGO_URI)
        console.log("Connected")
        const checkUser = await userDB.findOne({ email: email })

        if (!checkUser) {
            res.status(404).json({
                message: "User not found!"
            })
        }
        else {
            // Compare is used to decrypt and check the password of user is same or not
            const decryptPass = await compare(password, checkUser.password)

            if (email == checkUser.email && decryptPass) {

                const token = sign({
                    username: checkUser.username,
                    id: checkUser._id,
                    email: checkUser.email,
                    profile: checkUser.profile,
                    role: checkUser.role
                },
                    process.env.JWT_SECRET
                )

                res.status(200).json({
                    message: "Successfully sign in !",
                    token: token
                })
            }
            else {
                res.status(401).json({
                    message: "Invalid Credentials"
                })
            }
        }

    } catch (error) {

        res.json({
            message: "Error " + error
        })
    }
}

const signup = async (req, res) => {

    const { username, password, email } = req.body;

    try {

        // Now we successfully made a connection of DataBase
        await connect(process.env.MONGO_URI)
        console.log("DB Connected")

        // Now we handle the duplicationin database
        const checkExist = await userDB.exists({ email: email })

        if (checkExist) {
            res.status(403).json({
                message: "User Already Exists"
            })
        }
        else {
            // Now we insert the data in our db
            // We need to encrpyt password so attach a hash function with password
            await userDB.create({ username, email, password: await hash(password, 12) })
            console.log("Success")

            res.status(201).json({
                message: "Done"
            })
        }

    } catch (error) {
        res.json({
            message: "Error " + error
        })
    }

}

module.exports = { login, signup, getAllUsers }