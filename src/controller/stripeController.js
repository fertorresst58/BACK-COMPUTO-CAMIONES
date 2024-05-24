const Stripe = require('./../models/stripeModel')

const checkout = async (req, res) => {
  const product = req.body
  const session = await Stripe.checkoutSession(product)

  res.status(200).json({ 
    message: 'ENLACE A STRIPE CREADO EXITOSAMENTE',
    success: true,
    session
  })
}

const success = (req, res) => {
  res.send('PAGO EXITOSO, CIERRE LA VENTANA PARA CONTINUAR')
}

const cancel = (req, res) => {
  res.send('PAGO CANCELADO, CIERRE LA VENTANA PARA CONTINUAR')
}

module.exports = { checkout, success, cancel }