const admin = require('../config/firebase')
const IRoutes = require('../interfaces/IRoutes')
const firestore = admin.firestore()

class Routes extends IRoutes {
	constructor(id, arrivalTime, departureTime, destination, origin, price, seats, stops) {
		super()
		this.id = id
		this.arrivalTime = arrivalTime
		this.departureTime = departureTime
		this.destination = destination
		this.origin = origin
		this.price = price
		this.seats = seats
		this.stops = stops
	}

  static async getAllRoutes() {
    try {
      const snapshot = await firestore.collection('routes').get();
  
      const routes = [];
      for (const doc of snapshot.docs) {
        const routeData = doc.data();
        
        // Obtener los datos del documento referenciado en 'seats'
        if (routeData.seats) {
          const seatsSnapshot = await routeData.seats.get();
          if (seatsSnapshot.exists) {
            routeData.seats = seatsSnapshot.data();
          } else {
            routeData.seats = null; // o maneja esto como prefieras
          }
        }  
        routes.push(routeData);
      }
  
      return routes;
    } catch (err) {
      console.log('ERROR =>', err)
      throw new Error('ERROR AL OBTENER LAS RUTAS')
    }
  }

  static async updateSeats(routeId, selectedSeats, userId, availableSeats, bookedSeats) {
    const routeRef = firestore.collection('routes').doc('routeId'+routeId).collection('seats').doc('booked')
    console.log("🚀 ~ Routes ~ updateSeats ~ routeRef:", routeRef)
  
    try {
      // Obtén el documento actual
      const doc = await routeRef.get()
      if (doc.exists) {
        const data = doc.data()
  
        // Agrega el usuario a los asientos seleccionados
        const updatedSeats = {}
        selectedSeats.forEach(seat => {
          updatedSeats[seat] = [userId, data[seat][1], data[seat][2]] // Reutiliza el precio y disponibilidad actuales
        });
  
        // Actualiza los asientos en el documento
        for (const [seat, details] of Object.entries(updatedSeats)) {
          data[seat] = details
        }
  
        // Actualiza los campos available y booked
        data.available = availableSeats
        data.booked = bookedSeats
  
        // Guarda los cambios
        await routeRef.set(data, { merge: true })
  
        console.log('Asientos actualizados exitosamente.')
      } else {
        console.log('No se encontró el documento.')
      }
    } catch (error) {
      console.error('Error actualizando los asientos:', error);
    }
  }
}

module.exports = Routes