import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const NavBar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <nav className="bg-slate-800 py-4 px-8 flex items-center shadow-md border-b border-slate-700 justify-between">
      <Link
        to="/"
        className="text-2xl font-bold text-blue-400 tracking-wider hover:text-blue-300 transition-colors"
      >
        TECHIES
      </Link>

      <div className="justify-end flex">
        <div className="flex gap-x-4 items-center">
          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 text-white hover:text-violet-400 transition-colors bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg border border-slate-700"
              >
                <span className="text-xl">👤</span>
                <span className="font-medium">{user?.name}</span>
              </Link>
              <button
                onClick={logout}
                className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/50 cursor-pointer"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-300 hover:text-white transition-colors font-medium bg-slate-600 px-5 py-2 rounded-lg shadow-lg shadow-slate-600/20"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-violet-600 text-white px-5 py-2 rounded-lg hover:bg-violet-700 transition-colors shadow-lg shadow-violet-600/20 font-medium"
              >
                Register
              </Link>
            </>
          )}

          {user?.role === "ADMIN" && (
            <Link
              to="/admin"
              className="bg-violet-600/20 text-violet-400 px-4 py-2 rounded-lg hover:bg-violet-600/40 transition-colors border border-violet-500/50 mr-2"
            >
              Panel Admin
            </Link>
          )}
        </div>
        <Link
          to="/cart"
          className="relative flex items-center p-2 text-slate-300 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>

          
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-violet-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center transform translate-x-1 -translate-y-1">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
