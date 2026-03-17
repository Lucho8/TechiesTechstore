import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    pending: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/api/stats`, {
          headers: {
            "x-user-role": user?.role,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error trayendo estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "ADMIN") {
      fetchStats();
    }
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-4xl font-extrabold text-white mb-8 border-b border-slate-700 pb-4">
        Panel de Control
      </h2>

      {loading ? (
        <div className="text-violet-400 text-xl animate-pulse mb-10">
          Calculando finanzas... ⏳
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-linear-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-slate-400 font-medium">Ingresos Totales</h3>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-4xl font-black text-emerald-400">
              ${stats.revenue}
            </p>
          </div>

          <div className="bg-linear-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-slate-400 font-medium">Órdenes Pendientes</h3>
              <span className="text-2xl">⏳</span>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-black text-yellow-400">
                {stats.pending}
              </p>
              <p className="text-sm text-slate-500">
                de {stats.orders} totales
              </p>
            </div>
          </div>

          <div className="bg-linear-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-slate-400 font-medium">Productos Activos</h3>
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-4xl font-black text-violet-400">
              {stats.products}
            </p>
          </div>

          <div className="bg-linear-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-slate-400 font-medium">
                Usuarios Registrados
              </h3>
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-4xl font-black text-blue-400">{stats.users}</p>
          </div>
        </div>
      )}

      <h3 className="text-2xl font-bold text-white mb-6">Accesos Rápidos</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          to="/admin/products"
          className="bg-slate-800 hover:bg-violet-900/40 p-6 rounded-xl border border-slate-700 hover:border-violet-500/50 transition-all group"
        >
          <h4 className="text-xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">
            Gestionar Productos
          </h4>
          <p className="text-slate-400 text-sm">
            Crear, editar o eliminar stock del catálogo.
          </p>
        </Link>

        <Link
          to="/admin/categories"
          className="bg-slate-800 hover:bg-blue-900/40 p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all group"
        >
          <h4 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
            Gestionar Categorías
          </h4>
          <p className="text-slate-400 text-sm">
            Organizar los productos en secciones.
          </p>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-slate-800 hover:bg-emerald-900/40 p-6 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition-all group"
        >
          <h4 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
            Despachar Órdenes
          </h4>
          <p className="text-slate-400 text-sm">
            Cambiar el estado de las ventas realizadas.
          </p>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
