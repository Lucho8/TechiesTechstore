import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { user, loading } = useAuth()

  
  if (loading) return <div className="text-white">Cargando credenciales...</div>;

  console.log("Datos del usuario en el bouncer:", user);

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
