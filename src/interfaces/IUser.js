class IUser {
  static async createUser (nombre, apellidos, telefono, cumple, email, password, img) {}
  static async findUser (email) {}
  async verifyPassword (password) {}
}

module.exports = IUser