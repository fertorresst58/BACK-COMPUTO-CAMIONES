const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    
    const userDoc = await User.findUser(email)
    if (!userDoc) {
      return res.status(401).json({
        message: 'CREDENCIALES INVALIDAS',
        success: false
      })
    }

    const isValidPass = await userDoc.verifyPassword(password)
    if(!isValidPass) {
      return res.status(401).json({
        message: 'CREDENCIALES INVALIDAS',
        success: false
      })
    }

    const token = jwt.sign({ email: userDoc.email }, process.env.SECRET, { expiresIn: '1h' })
    res.status(200).json({ 
      message: 'LOGIN EXITOSO',
      success: true,
      token,
      user: userDoc
    })

  } catch (error) {
    res.status(500).json({
      message: 'ERROR EN EL SERVIDOR',
      success: false
    })
    console.error(error);
  }
}

const registerUser = async (req, res) => {
  try {
    const { id, nombre, apellidos, telefono, cumple, email, password, img } = req.body
    const existingUser = await User.findUser(email)
    if (existingUser) {
      return res.status(409).json({
        message: 'ERROR: EL CORREO YA ESTA REGISTRADO',
        success: false
      })
    }

    const newUser = await User.createUser(id, nombre, apellidos, telefono, cumple, email, password, img)
    res.status(201).json({
      message: 'USUARIO REGISTRADO SATISFACTORIAMENTE',
      success: true,
      user: newUser
    })
  } catch (error) {
    res.status(500).json({
      message: 'ERROR EN EL SERVIDOR',
      success: false,
      error
    })
  }
}
  
const updateUser = async (req, res) => {
  try {
    const { id, nombre, apellidos, cumple, telefono, email, img } = req.body
    const success = await User.updateUser(id, nombre, apellidos, cumple, telefono, email, img)
    
    if (success) {
      res.status(200).json({
        message: 'USUARIO ACTUALIZADO SATISFACTORIAMENTE',
        success: true,
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'ERROR EN EL SERVIDOR',
      success: false,
      error
    })
  }
}

module.exports = { registerUser, updateUser, loginUser }