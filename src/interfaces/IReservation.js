class IReservation {
  static async createUser (user, token, tipo, origen, destino, fechaSalida, pasajeros, asientos, costo, routeId) {}
  static async findUser (email) {}
}

module.exports = IReservation