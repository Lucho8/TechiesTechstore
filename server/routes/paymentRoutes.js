const express = require("express");
const router = express.Router();

const { MercadoPagoConfig, Preference } = require("mercadopago");

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

router.post("/create-preference", async (req, res) => {
  try {
    const { cartItems } = req.body;

    const items = cartItems.map((item) => ({
      title: item.name,
      unit_price: Number(item.price),
      quantity: Number(item.quantity),
      currency_id: "ARS",
    }));

    const preference = new Preference(client);

    const frontendUrl =
      process.env.FRONTEND_URL &&
      process.env.FRONTEND_URL !== "http://localhost:5173"
        ? process.env.FRONTEND_URL
        : "https://techies-techstore.vercel.app";

    const response = await preference.create({
      body: {
        items: items,
        back_urls: {
          success: `${frontendUrl}/cart`,
          failure: `${frontendUrl}/cart`,
          pending: `${frontendUrl}/cart`,
        },
        auto_return: "approved",
      },
    });

    res.status(200).json({ id: response.id });
  } catch (error) {
    console.error("🔥 Error al crear preferencia de Mercado Pago:", error);
    res.status(500).json({ error: "No se pudo generar el ticket de pago" });
  }
});

module.exports = router;
