const verifyAdmin = (req, res, next) => {
  // Leemos el "DNI" que nos tiene que mandar el frontend en los headers
  // (En una app Enterprise acá se lee y desencripta un Token JWT, pero la lógica es la misma)
  const userRole = req.headers["x-user-role"];

  // Si no mandó rol, o el rol no es ADMIN, lo sacamos volando
  if (!userRole || userRole !== "ADMIN") {
    return res.status(403).json({
      error: "No tenés permisos de Administrador para hacer esto.",
    });
  }

  // Si todo está bien y es ADMIN, la función next() le dice a Express: "Dejalo pasar a la ruta"
  next();
};

module.exports = { verifyAdmin };
