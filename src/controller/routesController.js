const jwt = require("jsonwebtoken");
const Routes = require("./../models/routesModel");

const getAllRoutes = async (req, res) => {
  try {
    const routes = await Routes.getAllRoutes();
    res.status(200).json({
      message: "Rutas obtenidas correctamente",
      success: true,
      routes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor",
      success: false,
      error: error.message,
    });
  }
};

const routes = async (req, res) => {
  try {
    const filters = {
      origin: req.query.origenViaje,
      destination: req.query.destinoViaje,
      date: req.query.fechaSalidaViaje,
      seats: req.query.pasajerosViaje,
    };

    const routes = await Routes.getAllRoutes();
    const routesFiltered = [];
    routes.forEach((item) => {
      const date = formatTimestampToDate(item.departureTime);

      if (filters.date === date) {
        if (filters.origin === item.origin) {
          if (filters.destination === item.destination) {
            if (filters.seats <= item.seats.available) {
              routesFiltered.push(item);
            }
          }
        }
      }
    });

    if (routesFiltered.length > 0) {
      res.status(200).json({
        message: "RUTAS OBTENIDAS EXITOSAMENTE",
        success: true,
        routes: routesFiltered,
      });
    } else {
      res.status(400).json({
        message:
          "NO HAY RUTAS DISPONIBLES PARA LA FECHA Y/O ORIGEN/DESTINO INGRESADOS",
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "ERROR EN EL SERVIDOR",
      success: false,
    });
  }
};

const formatTimestampToDate = (timestamp) => {
  const date = new Date(
    timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000
  );
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const createRoute = async (req, res) => {
  try {
    const {
      routeId,
      arrivalTime,
      departureTime,
      destination,
      origin,
      price,
      stops,
    } = req.body

    if (
      !routeId ||
      !arrivalTime ||
      !departureTime ||
      !destination ||
      !origin ||
      price === undefined ||
      !stops
    ) {
      return res.status(400).json({
        message: "Faltan parámetros requeridos para crear la ruta",
        success: false,
      });
    }

    const result = await Routes.createRoute({
      routeId,
      arrivalTime,
      departureTime,
      destination,
      origin,
      price,
      stops,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Error creando la ruta:", error);
    res.status(500).json({
      message: "Error en el servidor al crear la ruta",
      success: false,
      error: error.message,
    });
  }
}

const updateAllRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const { arrivalTime, departureTime, price, stops } = req.body;

    if (!id || !arrivalTime || !departureTime || price === undefined || !stops) {
      return res.status(400).json({
        message: "Faltan parámetros requeridos para actualizar la ruta",
        success: false,
      });
    }

    const result = await Routes.updateRoute(id, {
      arrivalTime,
      departureTime,
      price,
      stops,
    });

    res.status(200).json({
      message: "RUTA ACTUALIZADA CORRECTAMENTE",
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error actualizando la ruta:", error);
    res.status(500).json({
      message: "Error en el servidor al actualizar la ruta",
      success: false,
      error: error.message,
    });
  }
}

const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;
    await Routes.deleteRoute(id);

    res.status(200).json({
      message: "RUTA ELIMINADA CORRECTAMENTE",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "ERROR EN EL SERVIDOR",
      success: false,
      error,
    });
  }
}

const updateRoute = async (req, res) => {
  try {
    const { routeId, selectedSeats, user, availableSeats, bookedSeats } =
      req.body;
    await Routes.updateSeats(
      routeId,
      selectedSeats,
      user,
      availableSeats,
      bookedSeats
    );

    res.status(201).json({
      message: "RUTA ACTUALIZADA CORRECTAMENTE",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "ERROR EN EL SERVIDOR",
      success: false,
      error,
    });
  }
};

const modifyRouteSeats = async (req, res) => {
  try {
    const { routeId, available, booked } = req.body;

    if (!routeId || available === undefined || booked === undefined) {
      return res.status(400).json({
        message: "Faltan parámetros requeridos",
        success: false,
      });
    }

    // Llamar al modelo para actualizar los asientos
    const updatedData = await Routes.updateModifySeats(
      routeId,
      available,
      booked
    );

    res.status(200).json({
      message: "Asientos de la ruta actualizados correctamente",
      success: true,
      data: updatedData,
    });
  } catch (error) {
    console.error("Error modificando los asientos:", error);
    res.status(500).json({
      message: "Error en el servidor",
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  getAllRoutes,
  routes,
  deleteRoute,
  updateAllRoute,
  updateRoute,
  modifyRouteSeats,
  createRoute,
};
