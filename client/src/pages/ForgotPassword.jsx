import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Por favor, ingresá tu correo");

    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setEnviado(true);
      } else {
        toast.error(data.error || "Hubo un error");
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
        <h2 className="text-3xl font-bold text-white mb-2">
          Recuperar Clave 🔐
        </h2>

        {!enviado ? (
          <>
            <p className="text-slate-400 mb-6">
              Ingresá el correo de tu cuenta y te enviaremos un enlace mágico
              para recuperarla.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="text-sm text-slate-400 block mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg p-3 outline-none focus:border-violet-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-slate-600 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-violet-500/30"
              >
                {loading ? "Enviando cartero..." : "Enviar Enlace"}
              </button>
            </form>
          </>
        ) : (
          <div className="py-6">
            <span className="text-6xl mb-4 block">✉️</span>
            <p className="text-emerald-400 font-bold mb-2">
              ¡Revisá tu bandeja de entrada!
            </p>
            <p className="text-slate-400 text-sm">
              Si el correo está registrado, te llegará un enlace en los próximos
              minutos. No te olvides de revisar la carpeta de Spam.
            </p>
          </div>
        )}

        <div className="mt-6 text-sm text-slate-400">
          ¿Te acordaste la clave?{" "}
          <Link
            to="/login"
            className="text-violet-400 hover:underline font-bold"
          >
            Volver al Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
