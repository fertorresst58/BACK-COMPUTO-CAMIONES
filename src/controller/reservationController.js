const jwt = require('jsonwebtoken')
const Reservation = require('../models/reservationModel')

const registerReservation = async (req, res) => {
  try {
    const { user, token, tipo, origen, destino, fechaSalida, pasajeros, asientos, costo, routeId } = req.body

    const newReservation = await Reservation.createReservation(user, token, tipo, origen, destino, fechaSalida, pasajeros, asientos, costo, routeId)
    res.status(201).json({
      message: 'RESERVACIÓN REGISTRADA CORRECTAMENTE',
      success: true,
      reservation: newReservation
    })
  } catch (error) {
    res.status(500).json({
      message: 'ERROR EN EL SERVIDOR',
      success: false,
      error
    })
  }
}

const getReservations = async (req, res) => {
  try {
    const id = req.params.id
    console.log("🚀 ~ getReservations ~ id:", id)
  
    const tickets = await Reservation.findTickets(id)
  
    res.status(200).json({
      message: 'TICKETS ENCONTRADOS EXITOSAMENTE',
      success: true,
      tickets
    })
    
  } catch (error) {
    res.status(500).json({
      message: 'ERROR EN EL SERVIDOR',
      success: false,
      error
    })
  }
}

module.exports = { registerReservation, getReservations }