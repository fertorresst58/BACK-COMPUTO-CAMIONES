class IRoutes {
  static async getAllRoutes () {}
  static async updateSeats(routeId, selectedSeats, userId, availableSeats, bookedSeats) {}
  static async deleteRoute(routeId) {}
  static async updateModifySeats(routeId, availableSeats, booked, bookedSeats) {}
}

module.exports = IRoutes