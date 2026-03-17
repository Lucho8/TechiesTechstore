const verifyAdmin = (req, res, next) => {
  
  
  const userRole = req.headers["x-user-role"];

  
  if (!userRole || userRole !== "ADMIN") {
    return res.status(403).json({
      error: "No tenés permisos de Administrador para hacer esto.",
    });
  }

  
  next();
};

module.exports = { verifyAdmin };
