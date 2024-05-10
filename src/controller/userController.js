const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    
    const userDoc = await User.findByEmail(email)
    if (!userDoc) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    const isValidPass = await userDoc.verifyPassword(password)
    if(!isValidPass) {
      return res.status(401).json({
        message: 'Invalid Credentials'
      })
    }

    const token = jwt.sign({ email: userDoc.email }, process.env.SECRET, { expiresIn: '1h' })
    res.status(200).json({ 
      message: 'success',
      token
    })
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}

const registerUser = async (req, res) => {
  try {
    const { nombre, apellido, telefono, cumple, email, password, factura } = req.body
    const existingUser = await User.findByEmail(email)
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists'
      })
    }

    const newUser = await User.createUser(nombre, apellido, telefono, cumple, email, password, factura)
    res.status(201).json({
      message: 'User registered successfully',
      user: newUser
    })
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}

module.exports = { registerUser, loginUser, getAllUsers, deleteUser, updateUser }