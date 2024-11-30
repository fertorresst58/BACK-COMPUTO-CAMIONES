const jwt = require('jsonwebtoken')
const Routes = require('./../models/routesModel')

const routes = async (req, res) => {
  try {
    const filters = {
      origin: req.query.origenViaje,
      destination: req.query.destinoViaje,
      date: req.query.fechaSalidaViaje,
      seats: req.query.pasajerosViaje
    }
  
    const routes = await Routes.getAllRoutes()
    console.log ("Routes: ", routes)

    const routesFiltered = []
    routes.forEach(item => {
      const date = formatTimestampToDate(item.departureTime)
      
      if (filters.date === date) {
        if (filters.origin === item.origin) {
          if (filters.destination === item.destination) {
            if (filters.seats <= item.seats.available) {
              routesFiltered.push(item)
            }
          }
        }
      }
    })
    
    if (routesFiltered.length > 0) {
      res.status(200).json({
        message: 'RUTAS OBTENIDAS EXITOSAMENTE',
        success: true,
        routes: routesFiltered
      })
    } else {
      res.status(400).json({
        message: 'NO HAY RUTAS DISPONIBLES PARA LA FECHA Y/O ORIGEN/DESTINO INGRESADOS',
        success: false
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'ERROR EN EL SERVIDOR',
      success: false
    })
  }
}

const formatTimestampToDate = (timestamp) => {
  const date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const createRoute = async (req, res) => {
  try {
    const { routeId, arrivalTime, departureTime, destination, origin, price, stops } = req.body;

    if (!routeId || !arrivalTime || !departureTime || !destination || !origin || price === undefined || !stops) {
      return res.status(400).json({
        message: 'Faltan parámetros requeridos para crear la ruta',
        success: false
      })
    }

    const result = await Routes.createRoute({
      routeId,
      arrivalTime,
      departureTime,
      destination,
      origin,
      price,
      stops
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creando la ruta:', error);
    res.status(500).json({
      message: 'Error en el servidor al crear la ruta',
      success: false,
      error: error.message
    })
  }
}

const updateRoute = async (req, res) => {
  try {
    const { routeId, selectedSeats, user, availableSeats, bookedSeats } = req.body
    await Routes.updateSeats(routeId, selectedSeats, user, availableSeats, bookedSeats)
    
    res.status(201).json({
      message: 'RUTA ACTUALIZADA CORRECTAMENTE',
      success: true
    })
  } catch (error) {
    res.status(500).json({
      message: 'ERROR EN EL SERVIDOR',
      success: false,
      error
    })
  }
}

const modifyRouteSeats = async (req, res) => {
  try {
    const { routeId, available, booked } = req.body;

    if (!routeId || available === undefined || booked === undefined) {
      return res.status(400).json({
        message: 'Faltan parámetros requeridos',
        success: false
      })
    }

    // Llamar al modelo para actualizar los asientos
    const updatedData = await Routes.updateModifySeats(routeId, available, booked)

    console.log("update:", updatedData)

    res.status(200).json({
      message: 'Asientos de la ruta actualizados correctamente',
      success: true,
      data: updatedData
    })
  } catch (error) {
    console.error('Error modificando los asientos:', error)
    res.status(500).json({
      message: 'Error en el servidor',
      success: false,
      error: error.message
    })
  }
}

module.exports = {
  routes,
  updateRoute,
  modifyRouteSeats,
  createRoute
}