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

  static async createRoute({
    routeId,
    arrivalTime,
    departureTime,
    destination,
    origin,
    price,
    stops
  }) {
    try {
      if (!routeId || !arrivalTime || !departureTime || !destination || !origin || price === undefined || !stops) {
        throw new Error('Faltan parámetros requeridos para crear la ruta');
      }

      // Referencia para 'seats/booked'
      const seatsRef = firestore
        .collection('routes')
        .doc(`routeId${routeId}`)
        .collection('seats')
        .doc('booked');

      // Datos iniciales para los asientos
      const seatsData = { available: 16, booked: 0 }; // Valores iniciales

      // Crear la referencia de asientos
      await seatsRef.set(seatsData);

      // Configurar la ruta con referencia
      const routeData = {
        routeId,
        arrivalTime: admin.firestore.Timestamp.fromDate(new Date(arrivalTime)),
        departureTime: admin.firestore.Timestamp.fromDate(new Date(departureTime)),
        destination,
        origin,
        price,
        seats: seatsRef, // Guardar la referencia
        stops
      };

      // Guardar la ruta
      const routeRef = firestore.collection('routes').doc(`routeId${routeId}`);
      await routeRef.set(routeData);

      return { success: true, message: 'Ruta creada correctamente', data: routeData };
    } catch (error) {
      throw new Error(`Error creando la ruta: ${error.message}`);
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

  static async updateRoute(id, { arrivalTime, departureTime, price, stops }) {
    try {
      const routeRef = firestore.collection('routes').doc(`routeId${id}`);

      const routeData = {
        arrivalTime: admin.firestore.Timestamp.fromDate(new Date(arrivalTime)),
        departureTime: admin.firestore.Timestamp.fromDate(new Date(departureTime)),
        price,
        stops,
      };

      await routeRef.update(routeData);

      return { id, ...routeData };
    } catch (error) {
      throw new Error(`Error actualizando la ruta: ${error.message}`);
    }
  }

  static async deleteRoute(routeId) {
    try {
      const routeRef = firestore.collection('routes').doc(`routeId${routeId}`);
      const seatsRef = routeRef.collection('seats').doc('booked');

      // Eliminar la ruta y los asientos
      await routeRef.delete();
      await seatsRef.delete();

      return { routeId };
    } catch (error) {
      throw new Error(`Error eliminando la ruta: ${error.message}`);
    }
  }

  static async updateModifySeats(routeId, availableSeats, bookedSeats) {
    try {
      console.log("Entro")
      const bookedSeatsRef = firestore
        .collection('routes')
        .doc(`routeId${routeId}`)
        .collection('seats')
        .doc('booked')

      const bookedSeatsDoc = await bookedSeatsRef.get();
      if (!bookedSeatsDoc.exists) {
        throw new Error('El documento de asientos reservados no existe');
      }

      // Actualizar los datos de asientos disponibles y reservados
      await bookedSeatsRef.set(
        {
          available: availableSeats,
          booked: bookedSeats
        },
        { merge: true }
      );

      return { routeId, availableSeats, bookedSeats };
    } catch (error) {
      throw new Error(`Error actualizando los asientos: ${error.message}`);
    }
  }
}

module.exports = Routes