const admin = require('../config/firebase')
const IReservation = require('../interfaces/IReservation')
const firestore = admin.firestore()

class Reservation extends IReservation {
	constructor(user, token, tipo, origen, destino, fechaSalida, pasajeros, asientos, costo, routeId) {
		super()
		this.user = user
		this.token = token
		this.tipo = tipo
		this.origen = origen
		this.destino = destino
		this.fechaSalida = fechaSalida
		this.pasajeros = pasajeros
		this.asientos = asientos
		this.costo = costo
		this.routeId = routeId
	}

	static async createReservation(user, token, tipo, origen, destino, fechaSalida, pasajeros, asientos, costo, routeId) {
		try {
			const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)
			const reservation = firestore.collection('reservations').doc(user).collection('routeId'+routeId).doc(timestamp)

			await reservation.set({
				user,
				token,
				tipo,
				origen,
				destino,
				fechaSalida,
				pasajeros,
				asientos,
				costo,
				routeId
			})

			return new Reservation(user, token, tipo, origen, destino, fechaSalida, pasajeros, asientos, costo, routeId)
		} 
		catch (err) {
			console.log('ERROR =>', err)
			throw new Error('ERROR AL CREAR LA RESERVACIÓN')
		}
	}

	static async findTickets (id) {
		try {
			const docRef = firestore.collection('reservations').doc(id)
			const subcollections = await docRef.listCollections()
			let results = []

			for (const subcollection of subcollections) {
				const subcollectionId = subcollection.id
				const subdocuments = await subcollection.get()
				subdocuments.forEach(doc => {
					results.push({
						ruta: subcollectionId,
						validation: doc.id,
						data: doc.data()
					})
				})
			}

			return results
		} catch(err) {
			console.log('ERROR => ', err)
			throw new Error('ERROR AL ENCONTRAR AL USUARIO')
		}
	}
}

module.exports = Reservation