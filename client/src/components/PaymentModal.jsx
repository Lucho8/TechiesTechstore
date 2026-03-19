import { useState, useEffect } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { API_URL } from "../utils/api";
import { useCart } from "../context/CartContext";

// 1. Inicializamos Mercado Pago con tu llave pública
initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, { locale: "es-AR" });

function PaymentModal({ isOpen, onClose, onConfirm, total }) {
  // Ahora por defecto arranca en Mercado Pago
  const [paymentMethod, setPaymentMethod] = useState("mercadopago");
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Guardamos el ID del ticket de cobro y traemos el carrito
  const [preferenceId, setPreferenceId] = useState(null);
  const { cart } = useCart();

  // 2. Apenas se abre el modal, le pedimos el ticket al backend
  useEffect(() => {
    if (isOpen && cart.length > 0) {
      const getPreference = async () => {
        try {
          const res = await fetch(`${API_URL}/api/payments/create-preference`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cartItems: cart }),
          });
          const data = await res.json();
          if (data.id) {
            setPreferenceId(data.id);
          }
        } catch (error) {
          console.error("Error trayendo preferencia:", error);
        }
      };
      getPreference();
    }
  }, [isOpen, cart]);

  if (!isOpen) return null;

  const handleNameChange = (e) => setName(e.target.value.toUpperCase());
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    if (value.length <= 19) setCardNumber(value);
  };
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) value = value.slice(0, 2) + "/" + value.slice(2, 4);
    if (value.length <= 5) setExpiry(value);
  };
  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 3) setCvv(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Si eligió Mercado Pago, el botón oficial hace el trabajo, no nosotros
    if (paymentMethod === "mercadopago") return;

    if (
      cardNumber.length < 19 ||
      expiry.length < 5 ||
      cvv.length < 3 ||
      !name
    ) {
      alert(
        "Por favor, revisá que todos los datos de la tarjeta estén completos.",
      );
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirm(); // El pago simulado manda la orden
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden border border-slate-700 shadow-2xl animate-fade-in-up">
        <div className="bg-slate-900 p-6 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Pago Seguro</h2>
            <p className="text-slate-400 text-sm">
              Estás por pagar{" "}
              <span className="text-emerald-400 font-bold">${total}</span>
            </p>
          </div>
          {/* Botón cruz para cerrar */}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-3xl font-bold leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Selector de Método de Pago */}
          <div
            className={`${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
          >
            <label className="text-sm font-medium text-slate-400 mb-3 block">
              Elegí tu método de pago
            </label>
            <div className="flex gap-2">
              <label
                className={`flex-1 flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${paymentMethod === "mercadopago" ? "border-blue-500 bg-blue-500/10" : "border-slate-600 bg-slate-900 hover:bg-slate-800"}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mercadopago"
                  checked={paymentMethod === "mercadopago"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="hidden"
                />
                <span className="text-2xl mb-1">🤝</span>
                <span className="font-bold text-white text-xs text-center">
                  Mercado Pago
                </span>
              </label>
              <label
                className={`flex-1 flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${paymentMethod === "visa" ? "border-violet-500 bg-violet-500/10" : "border-slate-600 bg-slate-900 hover:bg-slate-800"}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="visa"
                  checked={paymentMethod === "visa"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="hidden"
                />
                <span className="text-2xl mb-1">💳</span>
                <span className="font-bold text-white text-xs">
                  VISA (Simulado)
                </span>
              </label>
              <label
                className={`flex-1 flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${paymentMethod === "mastercard" ? "border-orange-500 bg-orange-500/10" : "border-slate-600 bg-slate-900 hover:bg-slate-800"}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mastercard"
                  checked={paymentMethod === "mastercard"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="hidden"
                />
                <span className="text-2xl mb-1">🟧</span>
                <span className="font-bold text-white text-xs">MasterCard</span>
              </label>
            </div>
          </div>

          {/* RENDEREADO CONDICIONAL: ¿Qué botón mostramos? */}
          {paymentMethod === "mercadopago" ? (
            <div className="py-4 text-center min-h-37.5 flex flex-col justify-center">
              <p className="text-slate-300 mb-4 text-sm">
                Vas a ser redirigido a la plataforma segura de Mercado Pago.
              </p>

              {/* Si tenemos el ID, mostramos el botón. Si no, mostramos cargando */}
              {preferenceId ? (
                <Wallet
                  initialization={{ preferenceId: preferenceId }}
                  customization={{ texts: { valueProp: "security_details" } }}
                />
              ) : (
                <div className="flex justify-center py-4">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Inputs simulados para Tarjeta de Crédito (Solo se ven si elige Visa/Master) */}
              <fieldset
                disabled={isProcessing}
                className="space-y-4 opacity-100 transition-opacity disabled:opacity-50"
              >
                <div>
                  <label className="text-sm font-medium text-slate-400 mb-1 block">
                    Nombre en la tarjeta
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="JUAN PEREZ"
                    className="w-full bg-slate-900 text-white border border-slate-600 rounded-xl p-3 outline-none focus:border-violet-500 font-mono tracking-wider"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-400 mb-1 block">
                    Número de la tarjeta
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="0000 0000 0000 0000"
                    className="w-full bg-slate-900 text-white border border-slate-600 rounded-xl p-3 outline-none focus:border-violet-500 font-mono tracking-wider text-lg"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-slate-400 mb-1 block">
                      Vencimiento
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className="w-full bg-slate-900 text-white border border-slate-600 rounded-xl p-3 outline-none focus:border-violet-500 font-mono tracking-widest text-center"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-slate-400 mb-1 block">
                      CVV
                    </label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={handleCvvChange}
                      placeholder="•••"
                      className="w-full bg-slate-900 text-white border border-slate-600 rounded-xl p-3 outline-none focus:border-violet-500 font-mono tracking-widest text-center"
                      required
                    />
                  </div>
                </div>
              </fieldset>

              {/* Botón de pago simulado */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${isProcessing ? "bg-emerald-800 cursor-wait" : "bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 transform hover:-translate-y-1"}`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>{" "}
                      Procesando...
                    </>
                  ) : (
                    "Confirmar Pago Simulado"
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default PaymentModal;
