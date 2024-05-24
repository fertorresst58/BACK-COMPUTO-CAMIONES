const Stripe = require('stripe')
const IStripeSession = require('./../interfaces/IStripeSession')
require('dotenv').config()

const stripe = new Stripe(process.env.STRIPE)

class StripeSession extends IStripeSession {
	constructor(session) {
		super()
		this.session = session
	}

  static async checkoutSession(product) {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            product_data: {
              name: product.name,
              description: product.description
            },
            currency: 'mxn',
            unit_amount: product.unit_amount
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: 'http://localhost:5000/success',
      cancel_url: 'http://localhost:5000/cancel'
    })
    return session
  }
}

module.exports = StripeSession