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
	
	static async deleteTicketById(ticketId) {
		try {
			const reservationsRef = firestore.collection('reservations');
			const reservationDocs = await reservationsRef.listDocuments();
	
			let ticketData = null;
			let ticketFound = false;
	
			// Buscar el ticket dentro de las subcolecciones de cada `reservationId`
			for (const reservationDoc of reservationDocs) {
				const subcollections = await reservationDoc.listCollections();
				for (const subcollection of subcollections) {
					const ticketDoc = subcollection.doc(ticketId);
					const ticketSnapshot = await ticketDoc.get();
	
					if (ticketSnapshot.exists) {
						ticketData = ticketSnapshot.data(); // Obtén los datos del ticket antes de eliminarlo
						await ticketDoc.delete(); // Elimina el ticket
						ticketFound = true;
						break;
					}
				}
	
				if (ticketFound) break;
			}
	
			if (!ticketFound) {
				throw new Error('Ticket no encontrado');
			}
	
			// Actualizar los asientos ocupados solo si el ticket tiene asientos reservados
			if (ticketData && ticketData.routeId && Array.isArray(ticketData.asientos)) {
				const routeSeatsRef = firestore
					.collection('routes')
					.doc(`routeId${ticketData.routeId}`)
					.collection('seats')
					.doc('booked');
	
				const routeSeatsSnapshot = await routeSeatsRef.get();
	
				if (routeSeatsSnapshot.exists) {
					const seatData = routeSeatsSnapshot.data();
					const updatedSeats = { ...seatData }; // Copiar todos los asientos ocupados
	
					// Filtrar y eliminar solo los asientos reservados por el mismo usuario
					ticketData.asientos.forEach(asiento => {
						if (
							updatedSeats[asiento] &&
							updatedSeats[asiento][0] === ticketData.user
						) {
							delete updatedSeats[asiento]; // Elimina el asiento si pertenece al usuario
						} else {
							console.warn(
								`Asiento ${asiento} no pertenece al usuario ${ticketData.user}`
							);
						}
					});
	
					// Remover las claves no relacionadas con los asientos (e.g., `booked`, `available`)
					delete updatedSeats.booked;
					delete updatedSeats.available;
	
					// Recalcular los valores actualizados
					const bookedCount = Object.keys(updatedSeats).length; // Cantidad de asientos ocupados
					const available = 16 - bookedCount; // Máximo 16 asientos disponibles menos los ocupados
	
					// Actualizar el documento 'booked' correctamente
					await routeSeatsRef.set({
						...updatedSeats, // Actualiza los asientos restantes
						booked: bookedCount, // Actualiza el número total de ocupados
						available, // Actualiza los asientos disponibles
					});
	
					console.log('Asientos actualizados correctamente');
				} else {
					console.error('Documento booked no encontrado');
					throw new Error('Documento booked no encontrado en la ruta especificada');
				}
			}
	
			return true;
		} catch (error) {
			console.error('Error al eliminar el ticket o actualizar los asientos:', error.message);
			throw error;
		}
	}		
}

module.exports = Reservation