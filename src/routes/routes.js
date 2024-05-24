const express = require('express')
const router = express.Router()
const { registerUser, loginUser } = require('./../controller/userController')
const { routes, updateRoute } = require('./../controller/routesController')
const { checkout, success, cancel } = require('./../controller/stripeController')
const { registerReservation } = require('./../controller/reservationController')

const authenticateToken = require('./../auth/authMiddleware')

router.post('/register', registerUser)
router.post('/login', loginUser)

router.get('/routes', routes)
router.post('/update-route', updateRoute)

router.post('/create-checkout-session', checkout)
router.get('/success', success)
router.get('/cancel', cancel)

router.post('/update-reservation', registerReservation)

module.exports = router