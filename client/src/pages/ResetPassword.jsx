import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6)
      return toast.error("La clave debe tener al menos 6 caracteres");
    if (newPassword !== confirmPassword)
      return toast.error("Las contraseñas no coinciden");

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message + " 🚀");
        navigate("/login");
      } else {
        toast.error(data.error || "El enlace expiró o es inválido");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Crear Nueva Clave 🔑
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-sm text-slate-400 block mb-1">
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 6 caracteres"
              className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-1">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repetir contraseña"
              className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-emerald-500/30 mt-4"
          >
            {loading ? "Guardando..." : "Guardar y Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
