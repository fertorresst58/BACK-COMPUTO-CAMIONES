class IUser {
  static async createUser (nombre, apellido, telefono, cumple, email, password, factura) {}
  static async findByEmail (email) {}
  async verifyPassword (password) {}
}

module.exports = IUser