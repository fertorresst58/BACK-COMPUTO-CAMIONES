const express = require('express')
const router = express.Router()
const { registerUser, updateUser, loginUser } = require('./../controller/userController')
const { routes, createRoute, updateRoute, modifyRouteSeats } = require('./../controller/routesController')
const { checkout, success, cancel } = require('./../controller/stripeController')
const { registerReservation, getReservations } = require('./../controller/reservationController')

const authenticateToken = require('./../auth/authMiddleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.put('/updateUser', authenticateToken, updateUser)

router.get('/routes', routes)
router.post('/create-route', createRoute)
router.post('/update-route', updateRoute)
router.post('/modify-route-seats', modifyRouteSeats)

router.post('/create-checkout-session', checkout)
router.get('/success', success)
router.get('/cancel', cancel)

router.post('/update-reservation', registerReservation)
router.get('/get-reservations/:id', authenticateToken, getReservations)

module.exports = router