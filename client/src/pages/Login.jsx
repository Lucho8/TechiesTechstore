import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocation } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return setError("Completá todos los campos para Iniciar Sesion.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return setError("Use un formato de email válido.");
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user);
        navigate(destination);
      } else {
        setError(data.error || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error de conexión. ¿Prendiste el servidor?");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-700">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Crear Cuenta
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-400 mb-1 text-sm">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
              placeholder="juan@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 text-sm">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-violet-600/20 mt-6"
          >
            Iniciar Sesion
          </button>
        </form>

        <p className="text-slate-400 text-center mt-6 text-sm">
          ¿No tenes cuenta?{" "}
          <Link
            to="/register"
            className="text-violet-400 hover:text-violet-300 font-medium"
          >
            Registráte acá
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
