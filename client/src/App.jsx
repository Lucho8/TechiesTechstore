import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NavBar from "./components/NavBar.jsx";
import Cart from "./pages/Cart.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import Profile from "./pages/Profile.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import AdminRoute from "./components/AdminRoute.jsx";
import AdminCategories from "./pages/admin/AdminCategories.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";

function App() {
  return (
    <BrowserRouter>
      {/* 👈 2. AGREGAMOS EL TOASTER ACÁ ARRIBA, FLOTANDO EN TODA LA APP */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1e293b", // Color slate-800
            color: "#fff",
            border: "1px solid #334155", // Color slate-700
          },
          success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />

      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/mis-compras" element={<MyOrders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            {/* Acá meteremos el CRUD de productos después */}
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
