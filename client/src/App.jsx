import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NavBar from "./components/NavBar.jsx";
import Cart from "./pages/Cart.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import Profile from "./pages/Profile.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import AdminCategories from "./pages/admin/AdminCategories.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";

function App() {
  return (
    <BrowserRouter>
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
