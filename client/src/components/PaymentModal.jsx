import { useState } from "react";

function PaymentModal({ total, onSuccess, onClose }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="bg-slate-900 p-6 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            🔒 Pago Seguro
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✖
          </button>
        </div>

        <form onSubmit={handlePayment} className="p-6">
          <div className="mb-6 bg-violet-900/20 border border-violet-500/30 p-4 rounded-xl text-center">
            <p className="text-slate-400 text-sm mb-1">Total a pagar</p>
            <p className="text-3xl font-black text-emerald-400">${total}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 block mb-1">
                Número de Tarjeta (Simulada)
              </label>
              <input
                type="text"
                required
                placeholder="0000 0000 0000 0000"
                maxLength="16"
                className="w-full bg-slate-900 text-white p-3 rounded-lg border border-slate-600 focus:border-violet-500 outline-none font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 block mb-1">
                  Vencimiento
                </label>
                <input
                  type="text"
                  required
                  placeholder="MM/AA"
                  maxLength="5"
                  className="w-full bg-slate-900 text-white p-3 rounded-lg border border-slate-600 focus:border-violet-500 outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1">
                  Código (CVC)
                </label>
                <input
                  type="text"
                  required
                  placeholder="123"
                  maxLength="3"
                  className="w-full bg-slate-900 text-white p-3 rounded-lg border border-slate-600 focus:border-violet-500 outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-400 block mb-1">
                Nombre en la tarjeta
              </label>
              <input
                type="text"
                required
                placeholder="JUAN PEREZ"
                className="w-full bg-slate-900 text-white p-3 rounded-lg border border-slate-600 focus:border-violet-500 outline-none uppercase"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all flex justify-center items-center gap-2 ${
              isProcessing
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30"
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div>
                Procesando el pago...
              </>
            ) : (
              `Pagar $${total}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PaymentModal;
