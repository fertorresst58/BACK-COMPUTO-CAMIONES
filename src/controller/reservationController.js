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
    console.log("🚀 ~ getReservations ~ data:", tickets)
  
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

const deleteTicket = async (req, res) => {
  const ticketId = req.params.id;

  try {
      const success = await Reservation.deleteTicketById(ticketId);

      if (success) {
          return res.status(200).json({ success: true, message: 'Ticket eliminado' });
      } else {
          return res.status(400).json({ success: false, message: 'No se pudo eliminar el ticket' });
      }
  } catch (error) {
      console.error('Error al eliminar el ticket:', error.message);
      return res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
  }
};

module.exports = { registerReservation, getReservations, deleteTicket }