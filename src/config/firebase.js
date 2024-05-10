const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')

// INICIALIZAR FIREBASE ADMIN SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

module.exports = admin