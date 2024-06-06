const admin = require('../config/firebase')
const IUser = require('../interfaces/IUser')
const firestore = admin.firestore()
const bcrypt = require('bcrypt')

class User extends IUser {
	constructor(id, nombre, apellidos, telefono, cumple, email, password, img) {
		super()
		this.id = id
		this.nombre = nombre
		this.apellidos = apellidos
		this.cumple = cumple
		this.telefono = telefono
		this.email = email
		this.password = password,
		this.img = img
	}

	static async createUser(id, nombre, apellidos, telefono, cumple, email, password, img) {
		try {
			const hash = await bcrypt.hash(password, 10)
			const user = firestore.collection('users').doc(email)

			await user.set({
					id,
					nombre,
					apellidos,
					cumple,
					telefono,
					email, 
					password: hash,
					img
			})

			return new User(id, nombre, apellidos, cumple, telefono, email, password, img)
		} 
		catch (err) {
			console.log('ERROR =>', err)
			throw new Error('ERROR AL CREAR EL USUARIO')
		}
	}

	async verifyPassword (password) {
		return await bcrypt.compare(password, this.password)
	}

	static async findUser (email) {
		try {
			const user = firestore.collection('users').doc(email)
			const userDoc = await user.get()

			if (userDoc.exists) {
				const userData = userDoc.data()
				return new User (
					userData.id,
					userData.nombre, 
					userData.apellidos,
					userData.telefono,
					userData.cumple,
					userData.email,
					userData.password,
					userData.img
				)
			}
			return null
		} 
		catch(err) {
			console.log('ERROR => ', err)
			throw new Error('ERROR AL ENCONTRAR AL USUARIO')
		}
	}

	static async updateUser(id, nombre, apellidos, cumple, telefono, email, img) {
		try {
			const user = firestore.collection('users').doc(email)
			await user.update({ id, nombre, apellidos, cumple, telefono, email, img })

			return true
		} 
		catch (err) {
			console.log('ERROR =>', err)
			throw new Error('ERROR AL ACTUALIZAR EL USUARIO')
		}
	}
}

module.exports = User