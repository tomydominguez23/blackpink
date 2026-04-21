/* Copiá este archivo como config.js en la misma carpeta que admin.html
   y rellená URL + anon key. No subas config.js si el repo es público.

   <script src="config.js"></script> debe ir **antes** de supabase-client.js en admin-login.html y admin.html.
*/
window.__SUPABASE_CONFIG__ = {
  url: "https://TU_REFERENCIA.supabase.co",
  anonKey: "TU_CLAVE_ANON_AQUI",
};

/*
  Webpay Plus (Node): carpeta webpay-server/, copiar webpay-server/.env.example → .env
  y ver comentarios al inicio de webpay-server/server.cjs. Página de prueba: checkout-webpay-prueba.html.
  En producción el hosting debe proxear /api/webpay/* al proceso Node; checkout-carrito.html puede dejar la URL del API vacía (mismo sitio).
*/
