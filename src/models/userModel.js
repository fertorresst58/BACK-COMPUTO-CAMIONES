const admin = require('../config/firebase')
const IUser = require('../interfaces/IUser')
const firestore = admin.firestore()
const bcrypt = require('bcrypt')

class User extends IUser {
	constructor(nombre, apellido, telefono, cumple, email, password, factura) {
		super()
		this.nombre = nombre
		this.apellido = apellido
		this.cumple = cumple
		this.telefono = telefono
		this.email = email
		this.password = password
		this.factura = factura
	}

	static async createUser(nombre, apellido, telefono, cumple, email, password, factura) {
		try {
			const hash = await bcrypt.hash(password, 10)
			const user = firestore.collection('users').doc(email)

			await user.set({
					nombre,
					apellido,
					telefono,
					cumple,
					email, 
					password: hash,
					factura
			})

			return new User(nombre, apellido, telefono, cumple, email, password, factura)
		} 
		catch (err) {
			console.log('ERROR =>', err)
			throw new Error('Error creating user')
		}
	}

	async verifyPassword (password) {
		return await bcrypt.compare(password, this.password)
	}

	static async findByEmail (email) {
		try {
			const user = firestore.collection('users').doc(email)
			const userDoc = await user.get()

			if (userDoc.exists) {
				const userData = userDoc.data()
				return new User (userData.nombre, userData.apaterno, userData.amaterno, userData.direccion, userData.telefono, userData.email, userData.password)
			}
			return null
		} 
		catch(err) {
			console.log('Error => ', err)
			throw new Error('Error finding user')
		}
	}
}

module.exports = User