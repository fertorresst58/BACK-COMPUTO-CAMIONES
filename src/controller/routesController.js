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

module.exports = { routes, updateRoute }