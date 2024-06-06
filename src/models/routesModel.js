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

  static async updateSeats(routeId, selectedSeats, user, availableSeats, bookedSeats) {
    const routeRef = await firestore.collection('routes').doc('routeId'+routeId).collection('seats').doc('booked')

    try {
      // Obtén el documento actual
      const doc = await routeRef.get()
      if (doc.exists) {
        const data = doc.data()
  
        // Agrega el usuario a los asientos seleccionados
        selectedSeats.forEach(seat => {
          data[seat] = [user, 300]
        })
        data.available = availableSeats
        data.booked = bookedSeats
        console.log("🚀 ~ Routes ~ updateSeats ~ data:", data)
  
        // Guarda los cambios
        await routeRef.set(data, { merge: true })
      } else {
        console.log('No se encontró el documento.')
      }
    } catch (error) {
      console.error('Error actualizando los asientos:', error);
    }
  }
}

module.exports = Routes