const admin = require('../config/firebase')
const IReservation = require('../interfaces/IReservation')
const firestore = admin.firestore()

class Reservation extends IReservation {
	constructor(user, token, tipo, origen, destino, pasajeros, asientos, costo, routeId) {
		super()
		this.user = user
    this.token = token
    this.tipo = tipo
    this.origen = origen
    this.destino = destino
    this.pasajeros = pasajeros
    this.asientos = asientos
    this.costo = costo
    this.routeId = routeId
	}

	static async createReservation(user, token, tipo, origen, destino, pasajeros, asientos, costo, routeId) {
		try {
			const reservation = firestore.collection('reservations').doc(user)

			await reservation.set({
        user,
        token,
        tipo,
        origen,
        destino,
        pasajeros,
        asientos,
        costo,
        routeId
			})

			return new Reservation(user, token, tipo, origen, destino, pasajeros, asientos, costo, routeId)
		} 
		catch (err) {
			console.log('ERROR =>', err)
			throw new Error('ERROR AL CREAR LA RESERVACIÓN')
		}
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
					userData.cumple,
					userData.telefono,
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
}

module.exports = Reservation