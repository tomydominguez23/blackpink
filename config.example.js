/* Copiá este archivo como config.js en la misma carpeta que admin.html
   y rellená URL + anon key. No subas config.js si el repo es público.

   <script src="config.js"></script> debe ir **antes** de supabase-client.js en admin-login.html y admin.html.
*/
window.__SUPABASE_CONFIG__ = {
  url: "https://TU_REFERENCIA.supabase.co",
  anonKey: "TU_CLAVE_ANON_AQUI",
};

/*
  Webpay Plus (PHP): endpoints en /api/webpay/*.php.
  Copiar api/webpay/config.example.php -> api/webpay/config.php y completar secrets.
  Página de prueba: checkout-webpay-prueba.html.
*/
