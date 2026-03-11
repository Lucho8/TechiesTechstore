import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const productExists = prevCart.find((item) => item.id === product.id);

      if (productExists) {
        if (productExists.quantity >= product.stock) {
          alert(
            `¡Epa! Solo tenemos ${product.stock} unidades de ${product.name} en stock.`,
          );
          return prevCart;
        } else {
          return prevCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0,
  );

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        // Si encontramos el producto y su cantidad es mayor a 1, le restamos 1
        if (item.id === id && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item; // Si tiene 1, no bajamos a 0 (para eso está el botón Eliminar)
      }),
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        total,
        cartCount,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
