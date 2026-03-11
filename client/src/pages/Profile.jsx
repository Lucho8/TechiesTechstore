import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import MyOrders from "./MyOrders"; // Importamos la página de compras que ya armaste!

function Profile() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("datos"); // Empezamos mostrando los datos

  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row gap-6">
      {/* 📱 MENÚ LATERAL (Sidebar) */}
      <div className="w-full md:w-1/4 bg-slate-800 p-6 rounded-xl border border-slate-700 h-fit shadow-xl">
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-violet-600 rounded-full mx-auto mb-3 flex items-center justify-center text-4xl shadow-lg shadow-violet-500/30">
            👤
          </div>
          <h2 className="text-xl font-bold text-white">{user?.name}</h2>
          <span className="text-xs bg-slate-900 text-slate-400 px-3 py-1 rounded-full border border-slate-700 mt-2 inline-block">
            {user?.role === "ADMIN" ? "👑 Administrador" : "🛍️ Cliente"}
          </span>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => setActiveTab("datos")}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === "datos" ? "bg-violet-600 text-white" : "text-slate-400 hover:bg-slate-700 hover:text-white"}`}
          >
            📋 Mis Datos
          </button>
          <button
            onClick={() => setActiveTab("compras")}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === "compras" ? "bg-emerald-600 text-white" : "text-slate-400 hover:bg-slate-700 hover:text-white"}`}
          >
            📦 Mis Compras
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-700">
          <button
            onClick={logout}
            className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>

      {/* 🖥️ ÁREA PRINCIPAL (Donde cambia el contenido) */}
      <div className="w-full md:w-3/4">
        {/* PESTAÑA 1: MIS DATOS */}
        {activeTab === "datos" && (
          <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-slate-700 pb-4">
              Información Personal
            </h3>

            <div className="space-y-6 max-w-md">
              <div>
                <label className="text-sm text-slate-400 block mb-1">
                  Nombre Completo
                </label>
                <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-700">
                  {user?.name}
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400 block mb-1">
                  Correo Electrónico
                </label>
                <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-700">
                  {user?.email}
                </div>
              </div>

              {/* Acá dejaremos preparado el botón para el futuro PUT */}
              <button className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-colors border border-slate-600 mt-4">
                ✏️ Editar Perfil (Próximamente)
              </button>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: MIS COMPRAS */}
        {activeTab === "compras" && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden">
            {/* Como MyOrders ya es una página entera, simplemente la inyectamos acá */}
            <MyOrders />
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
