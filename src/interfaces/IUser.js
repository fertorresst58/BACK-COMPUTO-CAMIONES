class IUser {
  static async createUser (nombre, apellidos, telefono, cumple, email, password, img) {}
  static async findUser (email) {}
  async verifyPassword (password) {}
  static async updateUser(id, nombre, apellidos, cumple, telefono, email, img) {}
}

module.exports = IUser