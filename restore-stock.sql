-- Restaurar catálogo Blackpink Store
-- Respaldo del 26 ago 2026, 21:56 UTC. Pegar todo en Supabase → SQL Editor → Run.
-- Las fotos no vienen en este archivo: hay que volver a bajar Storage objects y subirlas al bucket product-images.

begin;

truncate table
  public.order_items,
  public.orders,
  public.product_audit_log,
  public.site_assets,
  public.products,
  public.tradein_models,
  public.tradein_categories
restart identity cascade;

insert into public.products (id, external_id, imei, title, category, category_label, condition, price, old_price, stock, cover_image_url, images, description, long_description, specs, reviews, colors, capacities, charger_price, published, created_at, updated_at) values
('f47bfecb-398c-49b2-a4be-b71c26d0d10d', 'custom-1776372972993', NULL, 'iPhone 16 Pro Max', 'iphone', 'iPhone', 'seminuevo', 980000, NULL, 10, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372962305-1776372962305-137.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372962305-1776372962305-137.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372962305-1776372964621-138.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372962305-1776372965848-139.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372962305-1776372966749-140.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372962305-1776372967921-141.png"]'::jsonb, 'El iPhone 16 Pro Max representa la cúspide de la innovación de Apple, combinando un diseño sofisticado con un rendimiento sin precedentes. Equipado con el nuevo chip A18 Pro, este modelo ofrece una velocidad de procesamiento asombrosa y eficiencia energética optimizada, ideal tanto para tareas cotidianas como para experiencias intensivas como juegos o edición de video. Su pantalla Super Retina XDR de 6,9 pulgadas ahora cuenta con mayor brillo en exteriores, colores más precisos y tecnología ProMotion para una fluidez excepcional en cada interacción.

Además, el sistema de cámaras profesionales del iPhone 16 Pro Max lleva la fotografía móvil a otro nivel. El nuevo sensor principal de 48 MP, junto con mejoras en el teleobjetivo y el ultra gran angular, permite capturar imágenes con detalles impresionantes incluso en condiciones de baja luz. Sumado a esto, la nueva función de grabación espacial es ideal para crear contenido inmersivo, especialmente pensado para la experiencia de Apple Vision Pro. Con su diseño en titanio de grado aeroespacial, una batería de mayor duración y conectividad USB-C ultrarrápida, el iPhone 16 Pro Max no solo es el más potente de la línea, sino también el más versátil.', '• Pantalla: Super Retina XDR, OLED de 6.9 pulgadas (diagonal) sin marco, resolución 2868 × 1320 a 460 ppi, Dynamic Island, pantalla siempre activa, ProMotion hasta 120 Hz, pantalla HDR, True Tone, amplia gama de colores (P3), respuesta háptica, contraste 2,000,000:1 (típico), 1000 nits máximo (típico), 1600 nits pico (HDR), 2000 nits pico (exterior), 1 nit mínimo.

• Procesador: Chip A18 Pro, CPU de 6 núcleos (2 rendimiento y 4 eficiencia), GPU de 6 núcleos, Neural Engine de 16 núcleos.

• Memoria RAM: 8 GB.

• Almacenamiento interno: 256 GB, 512 GB, 1 TB, no expandible.

• Cámara trasera: Sistema de cámaras Pro, Fusion de 48 MP (24 mm) con apertura ƒ/1.78, estabilización óptica por desplazamiento del sensor de segunda generación, 100% Focus Pixels, fotos en superalta resolución (24 MP y 48 MP), teleobjetivo 2x de 12 MP (48 mm) habilitado por la Fusion, ultra gran angular de 48 MP (13 mm) con apertura ƒ/2.2 y ángulo de visión de 120°, teleobjetivo 5x de 12 MP (120 mm) con apertura ƒ/2.8, diseño en tetraprisma, rango de zoom óptico 10x, zoom digital hasta 25x, Control de la Cámara, flash True Tone adaptativo, Photonic Engine, Deep Fusion, Smart HDR 5, modo Noche, retratos con modo Noche con escáner LiDAR, fotos panorámicas hasta 63 MP, estilos fotográficos, fotos espaciales, fotografía macro de 48 MP, Apple ProRAW.

• Cámara frontal: Cámara TrueDepth de 12 MP.

• Face ID: Reconocimiento facial mediante sistema TrueDepth para desbloqueo, autenticación y pagos.

• Batería: Reproducción de video hasta 33 horas, reproducción de video en streaming hasta 29 horas, reproducción de audio hasta 105 horas, batería de iones de litio recargable integrada.

• Conectividad: 5G (sub-6 GHz) con MIMO 4x4, Gigabit LTE con MIMO 4x4, Wi-Fi 7 (802.11be) con MIMO 2x2, Bluetooth 5.3, chip de banda ultraancha de segunda generación, tecnología Thread, NFC con modo de lectura, tarjetas Express con carga de reserva.

• Sistema operativo: iOS 18 de fábrica, actualizable a versiones posteriores.

• Resistencia al agua y polvo: IP68, hasta 30 minutos a una profundidad máxima de 6 metros (IEC 60529).

• Carga inalámbrica: Hasta 25 W con MagSafe y adaptador de 30 W o más, hasta 15 W con Qi2, hasta 7.5 W con Qi.

• Carga rápida: Hasta 50% en aproximadamente 30 minutos con adaptador de 20 W o más usando cable USB-C, o con adaptador de 30 W o más usando cargador MagSafe (se venden por separado).

• Puerto: USB-C, compatible con carga, DisplayPort, USB 3 hasta 10 Gb/s.

• Dimensiones: 163 × 77.6 × 8.25 mm.

• Peso: 227 g.

• Materiales: Diseño de titanio, frente de Ceramic Shield de última generación, parte posterior de vidrio mate texturizado.

• Colores disponibles: Titanio negro, titanio blanco, titanio natural, titanio del desierto.

• Otros: Botón de acción, Control de la Cámara, bandeja SIM disponible en modelos comprados fuera de EE.UU., en la caja incluye iPhone y cable de carga USB-C (1 m).

Condición: Semi Nuevo', '{"Estado": "Seminuevo", "_history": [{"at": 1776372972993, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 980000}, {"at": 1776373179280, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 980000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376682711, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 980000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780084716666, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 980000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 256, "price": 980000, "stock": 0, "oldPrice": null}, {"gb": 512, "price": 1018000, "stock": 10, "oldPrice": 1500000}, {"gb": 1000, "price": 1100000, "stock": 0, "oldPrice": null}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "Titanio Natural", "Blanco", "Titanio Del Desierto", "Plata"]}'::jsonb, '[]'::jsonb, '[{"hex": "#b9b3a9", "name": "Titanio Natural"}, {"hex": "#f1f1f1", "name": "Blanco"}, {"hex": "#c4a57a", "name": "Titanio Del Desierto"}, {"hex": "#c0c0c0", "name": "Plata"}]'::jsonb, '["256 GB", "512 GB", "1000 GB"]'::jsonb, NULL, true, '2026-04-16 20:56:13.483174+00', '2026-05-29 19:58:37.513191+00'),
('8495d4ab-5a0d-4460-b2b7-34456c644c05', 'custom-1776372204694', NULL, 'iPhone 15', 'iphone', 'iPhone', 'seminuevo', 572000, 970000, 10, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372194985-1776372194985-92.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372194985-1776372194985-92.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372194985-1776372195873-93.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372194985-1776372196506-94.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372194985-1776372197259-95.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372194985-1776372198096-96.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372194985-1776372198753-97.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372194985-1776372199334-98.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372194985-1776372199904-99.png"]'::jsonb, 'El iPhone 15 redefine la experiencia de usuario con una fusión perfecta de tecnología avanzada y diseño elegante. Con su pantalla Super Retina XDR Pro, el dispositivo ofrece una calidad de imagen sin precedentes, con colores vibrantes y negros profundos que hacen que cada detalle cobre vida. Equipado con el procesador A16 Bionic de última generación, el iPhone 15 garantiza un rendimiento excepcional y una eficiencia energética óptima, permitiendo a los usuarios disfrutar de aplicaciones y juegos exigentes con una fluidez sin igual.

Además, el iPhone 15 integra innovaciones revolucionarias en su sistema de cámaras, con un conjunto de lentes mejorado que captura imágenes sorprendentes en cualquier entorno. Desde retratos con una profundidad de campo impresionante hasta paisajes expansivos, la cámara del iPhone 15 ofrece una versatilidad incomparable. Con funciones de inteligencia artificial avanzadas, como el modo Noche mejorado y el reconocimiento de escenas, cada fotografía se optimiza automáticamente para obtener resultados excepcionales. En resumen, el iPhone 15 representa el pináculo de la ingeniería de Apple, ofreciendo una experiencia móvil incomparable para aquellos que buscan lo mejor en tecnología y estilo', 'Pantalla: Super Retina XDR de 6.1 pulgadas, con resolución de 2556 x 1179 píxeles (460 ppi), tecnología OLED, HDR10, Dolby Vision, True Tone y amplia gama de colores (P3). Soporta Dynamic Island, que reemplaza el notch con una interfaz interactiva.
Procesador: Apple A16 Bionic (seis núcleos, 64 bits) con motor neuronal de 16 núcleos.
Memoria RAM: 6 GB.
Almacenamiento interno: 128 GB, 256 GB, 512 GB (no expandible).
Cámara trasera: Sistema de doble cámara de 48 MP:Lente gran angular: 48 MP con apertura f/1.6, estabilización óptica de imagen (OIS).
Lente ultra gran angular: 12 MP con apertura f/2.4, campo de visión de 120°.
Grabación de video 4K a 24, 30 o 60 fps, Dolby Vision HDR en grabación, modo Cinemático para video, modo nocturno, Deep Fusion, Smart HDR 4.
Cámara frontal: 12 MP, apertura f/1.9, grabación de video 4K a 24, 30 o 60 fps, modo Cinemático para video, modo nocturno, Deep Fusion, Smart HDR 4, slo-mo (Slofies).
Face ID: Reconocimiento facial mediante la cámara TrueDepth para desbloquear el dispositivo, autenticación y pagos.
Batería: Hasta 20 horas de reproducción de video y hasta 80 horas de reproducción de audio.
Conectividad: 5G, Wi-Fi 6E (802.11ax) con MIMO, Bluetooth 5.3, NFC (solo para Apple Pay).
Sistema operativo: Originalmente con iOS 17, actualizable a versiones posteriores.
Resistencia al agua y polvo: Certificación IP68 (resistente al agua hasta 6 metros durante 30 minutos).
Carga inalámbrica: Compatible con cargadores MagSafe y Qi.
Carga rápida: Capaz de cargar hasta un 50% en 30 minutos con un cargador de 20 W o superior (no incluido en la caja).
Dimensiones: 147.6 x 71.6 x 7.8 mm.
Peso: 171 gramos.
Materiales: Cristal Ceramic Shield en la parte delantera, cristal texturizado en la parte trasera, con bordes de aluminio.
Colores disponibles: Negro, blanco, azul, verde y rosa.
Otros: Altavoces estéreo con soporte para Dolby Atmos, eliminación del conector de auriculares de 3.5 mm, soporte para Dual SIM (Nano SIM y eSIM).
Condición: Semi Nuevo', '{"Estado": "Seminuevo", "_history": [{"at": 1776372204693, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 530000}, {"at": 1776373190565, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 530000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376549204, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 530000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780085127422, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 572000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 128, "price": 572000, "stock": 10, "oldPrice": 970000}, {"gb": 256, "price": 580000, "stock": 0, "oldPrice": null}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "Grafito", "Sierra Azul", "Verde", "Titanio Blanco", "Oro", "Rosado", "Rojo"]}'::jsonb, '[]'::jsonb, '[{"hex": "#4a4a4a", "name": "Grafito"}, {"hex": "#9eb5cb", "name": "Sierra Azul"}, {"hex": "#7aa37a", "name": "Verde"}, {"hex": "#e8e8e6", "name": "Titanio Blanco"}, {"hex": "#e6c992", "name": "Oro"}, {"hex": "#f4b6c2", "name": "Rosado"}, {"hex": "#c0392b", "name": "Rojo"}]'::jsonb, '["128 GB", "256 GB"]'::jsonb, NULL, true, '2026-04-16 20:43:25.354369+00', '2026-05-29 20:05:28.288625+00'),
('4ae56cea-c09a-4eb3-9e1f-7ecbc43b75c2', 'custom-1776370460370', NULL, 'iPhone 11 Pro', 'iphone', 'iPhone', 'seminuevo', 220000, NULL, 0, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370450267-1776370450267-7.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370450267-1776370450267-7.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370450267-1776370451471-8.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370450267-1776370452386-9.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370450267-1776370453049-10.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370450267-1776370453672-11.png"]'::jsonb, 'El iPhone 11 Pro es uno de los teléfonos inteligentes más avanzados de Apple lanzados en septiembre de 2019. Este dispositivo cuenta con una pantalla OLED Super Retina XDR de 5,8 pulgadas, con una resolución de 2436 x 1125 píxeles y una densidad de píxeles de 458 ppp, lo que ofrece una calidad de imagen sorprendente con colores vibrantes y negros profundos. Además, su diseño de vidrio en la parte frontal y trasera, con un marco de acero inoxidable de alta calidad, le da un aspecto elegante y resistente.

El iPhone 11 Pro está equipado con el procesador A13 Bionic de seis núcleos de Apple, lo que garantiza un rendimiento rápido y fluido en todas las aplicaciones y juegos. Además, cuenta con una cámara trasera triple de 12 megapíxeles con un gran angular, un ultra gran angular y un teleobjetivo, lo que permite tomar fotos y videos impresionantes en cualquier situación. También tiene una cámara frontal TrueDepth de 12 megapíxeles con la función de Retina Flash para obtener selfies más naturales en condiciones de poca luz. 

En general, el iPhone 11 Pro es una excelente opción para aquellos usuarios que buscan un teléfono inteligente de gama alta con una pantalla OLED impresionante, un rendimiento excepcional y una cámara avanzada.', 'Pantalla: Super Retina XDR de 5.8 pulgadas, con resolución de 2436 x 1125 píxeles (458 ppi), tecnología OLED, HDR10, Dolby Vision, True Tone y amplia gama de colores (P3).
Procesador: Apple A13 Bionic (seis núcleos, 64 bits) con motor neuronal de tercera generación.
Memoria: RAM4 GB.
Almacenamiento interno: 64 GB, 256 GB o 512 GB (no expandible).
Cámara trasera: Sistema de triple cámara de 12 MP:Lente gran angular: Apertura f/1.8, estabilización óptica de imagen (OIS).Lente ultra gran angularApertura f/2.4, campo de visión de 120°.Lente teleobjetivoApertura f/2.0, estabilización óptica de imagen (OIS), zoom óptico 2x.
Grabación de video 4K a 24, 30 o 60 fps, modo nocturno, Deep Fusion, Smart HDR, modo Retrato con control de profundidad, iluminación de retrato.
Cámara frontal: 12 MP, apertura f/2.2, grabación de video 4K a 24, 30 o 60 fps, modo Retrato, Smart HDR, slo-mo (Slofies).
Face ID: Reconocimiento facial mediante la cámara TrueDepth para desbloquear el dispositivo, autenticación y pagos.
Batería: 3,046 mAh (no removible), con autonomía de hasta 18 horas en reproducción de video y hasta 65 horas en reproducción de audio.
Conectividad: 4G LTE Advanced, Wi-Fi 6 (802.11ax) con MIMO, Bluetooth 5.0, NFC (solo para Apple Pay).
Sistema operativo: Originalmente con iOS 13, actualizable a versiones posteriores.
Carga inalámbrica: Compatible con cargadores Qi.
Carga rápida: Capaz de cargar hasta un 50% en 30 minutos con el cargador de 18 W incluido en la caja.
Dimensiones: 144 x 71.4 x 8.1 mm.
Peso: 188 gramos.
Materiales: Cristal mate texturizado en la parte trasera, con bordes de acero inoxidable.
Colores disponibles: Oro, gris espacial, plata y verde noche.
Otros: Altavoces estéreo con soporte para Dolby Atmos, eliminación del conector de auriculares de 3.5 mm, soporte para Dual SIM (Nano SIM y eSIM).', '{"Estado": "Seminuevo", "_history": [{"at": 1776376991759, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 220000}, {"at": 1776370460369, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 220000}, {"at": 1777066310810, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 220000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1777066609042, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 220000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780086016986, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 220000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 64, "price": 220000, "stock": 0, "oldPrice": null}, {"gb": 128, "price": 250000, "stock": 0, "oldPrice": null}, {"gb": 256, "price": 290000, "stock": 0, "oldPrice": null}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "Blanco", "Gris Espacial", "Oro", "Verde Alpino"]}'::jsonb, '[]'::jsonb, '[{"hex": "#f1f1f1", "name": "Blanco"}, {"hex": "#4a4a4a", "name": "Gris Espacial"}, {"hex": "#e6c992", "name": "Oro"}, {"hex": "#4a5d4a", "name": "Verde Alpino"}]'::jsonb, '["64 GB", "128 GB", "256 GB"]'::jsonb, NULL, true, '2026-04-16 20:14:21.134505+00', '2026-05-29 20:20:17.685316+00'),
('08ea953e-babe-45d1-9ec4-7dc28b2b8ae9', 'custom-1777066715284', NULL, 'Audifonos Airpods Air 4', 'otros', 'Otros', 'seminuevo', 25000, 40000, 1, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1777066701261-1777066701261-Captura_de_pantalla_2026-04-24_172749.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1777066701261-1777066701261-Captura_de_pantalla_2026-04-24_172749.png"]'::jsonb, 'Audífonos AirPods Air 4
Disfruta de libertad total y un sonido limpio con los AirPods Air 4, la combinación perfecta entre comodidad, tecnología y estilo. Ideales para el uso diario, te acompañan en cada momento con una experiencia inalámbrica simple y eficiente.

Sonido claro y equilibrado
Escucha tu música, videos y llamadas con una calidad de audio nítida y estable, pensada para el día a día.

Conexión rápida y automática
Se conectan al instante a tu dispositivo, permitiéndote usarlos sin configuraciones complicadas.

Diseño cómodo y ligero
Su formato ergonómico se adapta naturalmente a tu oído, brindando comodidad incluso durante largas horas de uso.

Batería que te acompaña todo el día
Disfruta de varias horas de reproducción continua y recárgalos fácilmente con su estuche portátil.

Perfectos para cualquier momento
Llévalos al trabajo, estudio o entrenamiento gracias a su diseño práctico y fácil de transportar.', 'Audífonos AirPods Air 4
Disfruta de libertad total y un sonido limpio con los AirPods Air 4, la combinación perfecta entre comodidad, tecnología y estilo. Ideales para el uso diario, te acompañan en cada momento con una experiencia inalámbrica simple y eficiente.

Sonido claro y equilibrado
Escucha tu música, videos y llamadas con una calidad de audio nítida y estable, pensada para el día a día.

Conexión rápida y automática
Se conectan al instante a tu dispositivo, permitiéndote usarlos sin configuraciones complicadas.

Diseño cómodo y ligero
Su formato ergonómico se adapta naturalmente a tu oído, brindando comodidad incluso durante largas horas de uso.

Batería que te acompaña todo el día
Disfruta de varias horas de reproducción continua y recárgalos fácilmente con su estuche portátil.

Perfectos para cualquier momento
Llévalos al trabajo, estudio o entrenamiento gracias a su diseño práctico y fácil de transportar.', '{"Estado": "Seminuevo", "_history": [{"at": 1777066715283, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 25000}, {"at": 1777066721832, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 25000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 128, "price": 25000, "stock": 1, "oldPrice": 40000}], "Categoría": "Otros", "_colorImages": {}, "_imageColors": [""]}'::jsonb, '[]'::jsonb, '[]'::jsonb, '["128 GB"]'::jsonb, NULL, true, '2026-04-24 21:38:34.956758+00', '2026-04-24 21:38:40.467384+00'),
('1ace2c77-6904-423f-9df8-399df841a622', 'custom-1776371748842', NULL, 'iPhone 13 mini', 'iphone', 'iPhone', 'seminuevo', 382000, 799000, 1, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371740480-1776371740480-49.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371740480-1776371740480-49.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371740480-1776371741410-50.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371740480-1776371742075-51.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371740480-1776371742684-52.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371740480-1776371743294-53.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371740480-1776371743895-54.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371740480-1776371744497-55.png"]'::jsonb, 'El iPhone 13 mini es el último modelo de Apple en la línea de dispositivos compactos. Con una pantalla Super Retina XDR de 5.4 pulgadas, el dispositivo ofrece una experiencia de visualización impresionante con colores vibrantes y detalles nítidos. Además, cuenta con un sistema de cámara dual de 12 megapíxeles que te permite tomar fotos y videos impresionantes incluso en condiciones de poca luz. La cámara también tiene la capacidad de grabar videos en calidad 4K a 60 cuadros por segundo, lo que hace que las grabaciones sean aún más impresionantes.

El iPhone 13 mini también cuenta con el chip A15 Bionic, que es rápido y eficiente, lo que significa que podrás realizar tareas exigentes sin problemas. Además, el dispositivo es resistente al agua y al polvo, lo que lo hace perfecto para aquellos que llevan un estilo de vida activo. Con la conectividad 5G, podrás navegar por la web, descargar aplicaciones y transmitir videos a velocidades increíblemente rápidas. Además, el dispositivo cuenta con una batería duradera y la capacidad de carga rápida inalámbrica, lo que significa que podrás disfrutar del dispositivo durante todo el día sin preocuparte por quedarte sin energía. 

En resumen, el iPhone 13 mini es una excelente opción para aquellos que buscan un dispositivo compacto, potente y con una excelente cámara.', 'Pantalla: Super Retina XDR de 5.4 pulgadas, con resolución de 2340 x 1080 píxeles (476 ppi), tecnología OLED, HDR10, Dolby Vision, True Tone y amplia gama de colores (P3).
Procesador: Apple A15 Bionic (seis núcleos, 64 bits) con motor neuronal de 16 núcleos.
Memoria RAM: 4 GB.
Almacenamiento interno: 128 GB, 256 GB o 512 GB (no expandible).
Cámara trasera: Doble cámara de 12 MP:Lente gran angular: Apertura f/1.6, estabilización óptica de imagen (OIS).
Lente ultra gran angular: Apertura f/2.4, campo de visión de 120°.
Grabación de video 4K a 24, 30 o 60 fps, modo Cinemático para video, modo nocturno, Deep Fusion, Smart HDR 4, modo Retrato con control de profundidad.
Cámara frontal: 12 MP, apertura f/2.2, grabación de video 4K a 24, 30 o 60 fps, modo Cinemático para video, modo nocturno, Deep Fusion, Smart HDR 4, slo-mo (Slofies).
Face ID: Reconocimiento facial mediante la cámara TrueDepth para desbloquear el dispositivo, autenticación y pagos.
Batería: 2,438 mAh (no removible), con autonomía de hasta 17 horas en reproducción de video y hasta 55 horas en reproducción de audio.
Conectividad: 5G, 4G LTE Advanced, Wi-Fi 6 (802.11ax) con MIMO, Bluetooth 5.0, NFC (solo para Apple Pay).
Sistema operativo: Originalmente con iOS 15, actualizable a versiones posteriores.
Carga inalámbrica: Compatible con cargadores Qi y MagSafe.
Carga rápida: Capaz de cargar hasta un 50% en 30 minutos con un cargador de 20 W o superior (no incluido en la caja).
Dimensiones: 131.5 x 64.2 x 7.7 mm.
Peso: 140 gramos.
Materiales: Cristal tanto en la parte delantera como trasera (Ceramic Shield), con bordes de aluminio.
Colores disponibles: Rojo (Product RED), medianoche, starlight, azul y rosa.
Otros: Altavoces estéreo, soporte para Dolby Atmos, eliminación del conector de auriculares de 3.5 mm, soporte para Dual SIM (Nano SIM y eSIM).
Condición: Semi Nuevo.', '{"Estado": "Seminuevo", "_history": [{"at": 1776371748841, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 350000}, {"at": 1776373193840, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 350000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376367905, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 350000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780085664931, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 382000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 128, "price": 382000, "stock": 1, "oldPrice": 799000}, {"gb": 256, "price": 400000, "stock": 0, "oldPrice": null}, {"gb": 512, "price": 448000, "stock": 0, "oldPrice": null}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "Ultramarino", "Rojo", "Verde", "Blanco", "Azul", "Rosado"]}'::jsonb, '[]'::jsonb, '[{"hex": "#2f3e5c", "name": "Ultramarino"}, {"hex": "#c0392b", "name": "Rojo"}, {"hex": "#7aa37a", "name": "Verde"}, {"hex": "#f1f1f1", "name": "Blanco"}, {"hex": "#4f6d8a", "name": "Azul"}, {"hex": "#f4b6c2", "name": "Rosado"}]'::jsonb, '["128 GB", "256 GB", "512 GB"]'::jsonb, NULL, true, '2026-04-16 20:35:49.456394+00', '2026-05-29 20:14:25.905188+00'),
('f88e5ec3-4493-49f6-bea9-00fe1c16c51f', 'custom-1777066655467', NULL, 'Cargador Carga Rapida Tipo C OEM', 'otros', 'Otros', 'seminuevo', 15000, NULL, 1, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1777066654418-1777066654418-Captura_de_pantalla_2026-04-24_172743.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1777066654418-1777066654418-Captura_de_pantalla_2026-04-24_172743.png"]'::jsonb, 'Cargador Tipo C de Carga Rápida para iPhone
Olvídate de las cargas lentas y dale a tu iPhone la potencia que necesita con este cargador Tipo C de carga rápida. Diseñado para maximizar la velocidad de carga y optimizar el rendimiento de tu batería, es el complemento ideal para tu día a día.


Más batería en menos tiempo
Gracias a su tecnología de carga rápida, puedes obtener hasta un 50% de batería en pocos minutos. Perfecto para cuando necesitas salir rápido de casa.


Energía inteligente
Este cargador adapta automáticamente la potencia según tu dispositivo, evitando daños y alargando la vida útil de la batería.


Conexión moderna Tipo C
Ofrece una conexión más eficiente, estable y rápida en comparación con cargadores tradicionales.


Protección avanzada
Sistema de seguridad integrado contra sobrecarga, sobrecalentamiento y cortocircuitos para una carga confiable en todo momento.


Diseño compacto y resistente
Ligero, fácil de transportar y fabricado con materiales duraderos para acompañarte en cualquier lugar.

Carga más rápido, vive sin pausas. Haz que tu iPhone siempre esté listo cuando lo necesites.', 'Cargador Tipo C de Carga Rápida para iPhone
Olvídate de las cargas lentas y dale a tu iPhone la potencia que necesita con este cargador Tipo C de carga rápida. Diseñado para maximizar la velocidad de carga y optimizar el rendimiento de tu batería, es el complemento ideal para tu día a día.


Más batería en menos tiempo
Gracias a su tecnología de carga rápida, puedes obtener hasta un 50% de batería en pocos minutos. Perfecto para cuando necesitas salir rápido de casa.


Energía inteligente
Este cargador adapta automáticamente la potencia según tu dispositivo, evitando daños y alargando la vida útil de la batería.


Conexión moderna Tipo C
Ofrece una conexión más eficiente, estable y rápida en comparación con cargadores tradicionales.


Protección avanzada
Sistema de seguridad integrado contra sobrecarga, sobrecalentamiento y cortocircuitos para una carga confiable en todo momento.


Diseño compacto y resistente
Ligero, fácil de transportar y fabricado con materiales duraderos para acompañarte en cualquier lugar.

Carga más rápido, vive sin pausas. Haz que tu iPhone siempre esté listo cuando lo necesites.', '{"Estado": "Seminuevo", "_history": [{"at": 1777066655467, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 15000}, {"at": 1777066665977, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 15000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 128, "price": 15000, "stock": 1, "oldPrice": null}], "Categoría": "Otros", "_colorImages": {}, "_imageColors": [""]}'::jsonb, '[]'::jsonb, '[]'::jsonb, '["128 GB"]'::jsonb, NULL, true, '2026-04-24 21:37:34.434434+00', '2026-04-24 21:37:44.581902+00'),
('74dbef90-b232-4a45-b29f-1c299968d3a5', 'custom-1777066769000', NULL, 'Audifonos Airpods Pro 2 OEM', 'otros', 'Otros', 'seminuevo', 35000, 50000, 1, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1777066754814-1777066754814-Captura_de_pantalla_2026-04-24_172757.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1777066754814-1777066754814-Captura_de_pantalla_2026-04-24_172757.png"]'::jsonb, 'Audífonos AirPods Pro 2
Lleva tu experiencia de sonido a otro nivel con los AirPods Pro 2, diseñados para ofrecer audio envolvente, comodidad total y tecnología avanzada en cada detalle. Perfectos para música, llamadas y uso diario, combinan rendimiento premium con un diseño elegante y práctico.

Sonido de alta calidad
Disfruta de graves profundos, agudos nítidos y un audio equilibrado que mejora cada canción, podcast o llamada.

Cancelación de ruido activa
Aísla el sonido exterior y concéntrate en lo que realmente importa. Ideal para viajes, trabajo o momentos de concentración.

Modo ambiente
Escucha lo que ocurre a tu alrededor sin quitarte los audífonos, perfecto para mayor seguridad y comodidad en movimiento.

Batería de larga duración
Horas de reproducción continua con una sola carga y estuche que extiende su autonomía para todo el día.

Diseño cómodo y resistente
Ajuste ergonómico con almohadillas suaves que se adaptan a tu oído, además de resistencia al sudor y salpicaduras.', 'Audífonos AirPods Pro 2
Lleva tu experiencia de sonido a otro nivel con los AirPods Pro 2, diseñados para ofrecer audio envolvente, comodidad total y tecnología avanzada en cada detalle. Perfectos para música, llamadas y uso diario, combinan rendimiento premium con un diseño elegante y práctico.

Sonido de alta calidad
Disfruta de graves profundos, agudos nítidos y un audio equilibrado que mejora cada canción, podcast o llamada.

Cancelación de ruido activa
Aísla el sonido exterior y concéntrate en lo que realmente importa. Ideal para viajes, trabajo o momentos de concentración.

Modo ambiente
Escucha lo que ocurre a tu alrededor sin quitarte los audífonos, perfecto para mayor seguridad y comodidad en movimiento.

Batería de larga duración
Horas de reproducción continua con una sola carga y estuche que extiende su autonomía para todo el día.

Diseño cómodo y resistente
Ajuste ergonómico con almohadillas suaves que se adaptan a tu oído, además de resistencia al sudor y salpicaduras.', '{"Estado": "Seminuevo", "_history": [{"at": 1777066768999, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 35000}, {"at": 1777066774577, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 35000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 128, "price": 35000, "stock": 1, "oldPrice": 50000}], "Categoría": "Otros", "_colorImages": {}, "_imageColors": [""]}'::jsonb, '[]'::jsonb, '[]'::jsonb, '["128 GB"]'::jsonb, NULL, true, '2026-04-24 21:39:28.367824+00', '2026-04-24 21:39:33.148136+00'),
('b5fbf104-45ff-4ca4-83f3-32df1d140c25', 'custom-1776373367502', NULL, 'iPhone 17 Pro Max', 'iphone', 'iPhone', 'seminuevo', 1320000, 1500000, 20, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776373355714-1776373355714-159.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776373355714-1776373355714-159.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776373355714-1776373357181-160.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776373355714-1776373358077-161.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776373355714-1776373358842-162.png"]'::jsonb, 'El iPhone 17 Pro Max lleva el concepto de potencia y elegancia al siguiente nivel, pensado para quienes buscan lo mejor en desempeño, cámara y autonomía. Fabricado con titanio de grado aeroespacial y bordes aún más delgados, ofrece una sensación premium, resistente y ligera a la vez.

Equipa el nuevo chip A19 Pro junto a 12 GB de RAM, ofreciendo un rendimiento sin precedentes para edición de video profesional, juegos de alta exigencia y flujos de trabajo intensivos. Su sistema de refrigeración con cámara de vapor optimiza la eficiencia térmica, manteniendo un desempeño estable incluso bajo carga máxima.

La impresionante pantalla Super Retina XDR OLED de 6,9 pulgadas brinda una experiencia visual inmersiva con brillo máximo de 3000 nits, frecuencia adaptativa de 120 Hz con ProMotion, soporte HDR y modo Always-On, garantizando nitidez y fluidez en todo momento.

El sistema de cámaras Fusion redefine la fotografía móvil: tres lentes de 48 MP (gran angular, ultra gran angular y teleobjetivo periscópico de hasta 10× óptico) junto a una cámara frontal de 18 MP con Center Stage permiten capturar imágenes con precisión profesional y videos de nivel cinematográfico.

La batería de gran capacidad ofrece una autonomía excepcional, con muchas más horas de uso intensivo y carga rápida, inalámbrica y MagSafe.

Resistente al agua y al polvo con certificación IP68, el iPhone 17 Pro Max está disponible en colores Cosmic Orange, Azul Profundo y Plata, combinando un diseño imponente con tecnología de vanguardia para quienes exigen el máximo rendimiento en cada detalle.', 'Pantalla: Super Retina XDR, 6.9-inch (diagonal) all-screen OLED display, resolución 2868 × 1320 a 460 ppi, Dynamic Island, Always-On display, ProMotion hasta 120 Hz, HDR, True Tone, amplia gama de colores (P3), Haptic Touch, contraste típico 2,000,000:1, varios niveles de brillo pico y antirreflectante.
Procesador: Apple A19 Pro chip, CPU de 6 núcleos (2 rendimiento y 4 eficiencia), GPU de 6 núcleos con Neural Accelerators, Neural Engine de 16 núcleos, trazado de rayos acelerado por hardware.
Memoria RAM: 12 GB.
Almacenamiento interno: 256 GB, 512 GB, 1 TB, 2 TB, no expandible.
Cámara trasera: Sistema de cámara Pro Fusion triple, 48 MP Fusion Main con apertura ƒ/1.78 y estabilización óptica por desplazamiento del sensor, 48 MP Fusion Ultra Wide con apertura ƒ/2.2 y 120° FOV, 48 MP Fusion Telephoto 100 mm (4×) con tetraprism y 48 MP optical-quality 8× telephoto (200 mm), zoom óptico 8×, zoom digital hasta 40×, Photonic Engine, Deep Fusion, Smart HDR 5, macro y panorámicas, ProRAW y video ProRes/Log con múltiples fps.
Cámara frontal: 18 MP Center Stage TrueDepth, apertura ƒ/1.9, autofocus con Focus Pixels, HDR, Deep Fusion, Smart HDR 5, soporte para grabación 4K Dolby Vision y modos avanzados de video.
Face ID: Face ID habilitado por TrueDepth y cámara frontal Center Stage para desbloqueo, autenticación y Apple Pay.
Batería: Batería integrada de ion-litio recargable, hasta 39 horas de reproducción de video, hasta 35 horas de video en streaming, carga rápida hasta 50 % en ~20 min con 40 W o más (USB-C), hasta 50 % en ~30 min con 30 W o más (MagSafe).
Conectividad: 5G (sub-6 GHz y mmWave) con 4×4 MIMO, Gigabit LTE, Wi-Fi 7 (802.11be) con 2×2 MIMO, Bluetooth 6, Thread, Apple second-generation Ultra Wideband chip, NFC con modo lector y Express Cards con power reserve, GPS (varios sistemas).
Sistema operativo: iOS 26 de fábrica, actualizable a versiones posteriores.
Resistencia al agua y polvo: Certificación IP68 (hasta 6 metros durante 30 min, IEC 60529).
Carga inalámbrica: MagSafe inalámbrico hasta 25 W, Qi2 hasta 25 W, Qi hasta 7.5 W.
Carga rápida: Hasta 50 % de carga en aproximadamente 20 min con adaptador de 40 W o superior (USB-C) o hasta 30 min con adaptador de 30 W o superior (MagSafe), adaptadores no incluidos.
Puerto: USB-C con soporte para DisplayPort y USB 3 (hasta 10 Gb/s) para carga y transferencia de datos.
Dimensiones: 163.4 × 78.0 × 8.75 mm.
Peso: 233 g.
Materiales: Diseño unibody de aluminio con Ceramic Shield 2 frontal y posterior.
Colores disponibles: Silver, Cosmic Orange, Deep Blue.
Otros: Botón de Acción, Control de Cámara, altavoces estéreo, sensores avanzados (LiDAR, giroscopio, barómetro), Dual eSIM avanzado, Crash Detection, Emergency SOS via satellite.
Condición: Semi Nuevo', '{"Estado": "Seminuevo", "_history": [{"at": 1776373367502, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 1350000}, {"at": 1776373957761, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 1350000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376086073, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 1350000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376140709, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 1350000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780084531461, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 1320000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 256, "price": 1320000, "stock": 10, "oldPrice": 1500000}, {"gb": 512, "price": 1420000, "stock": 10, "oldPrice": 1550000}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "Blanco", "Ultramarino", "Coral"]}'::jsonb, '[]'::jsonb, '[{"hex": "#f1f1f1", "name": "Blanco"}, {"hex": "#2f3e5c", "name": "Ultramarino"}, {"hex": "#ff6f55", "name": "Coral"}]'::jsonb, '["256 GB", "512 GB"]'::jsonb, NULL, true, '2026-04-16 21:02:47.973914+00', '2026-05-29 19:55:32.120016+00'),
('167e2a4c-7951-4cb7-809a-2a98bc178dc7', 'custom-1776371852976', NULL, 'iPhone 14', 'iphone', 'iPhone', 'seminuevo', 456000, 899000, 3, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371835429-1776371835429-67.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371835429-1776371835429-67.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371835429-1776371836607-68.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371835429-1776371837890-69.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371835429-1776371839022-70.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371835429-1776371839887-71.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371835429-1776371840910-72.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371835429-1776371841639-73.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371835429-1776371842390-74.png"]'::jsonb, 'El iPhone 14 es la última joya de la corona de Apple, representando la vanguardia de la tecnología móvil. Con un diseño elegante y sofisticado, este dispositivo cautiva a primera vista. Su cuerpo de cristal pulido y su marco metálico sin costuras le confieren un aspecto lujoso y moderno. La pantalla OLED de última generación abarca todo el frente del teléfono, ofreciendo una calidad de imagen excepcional y colores vibrantes. Además, el iPhone 14 cuenta con un lector de huellas integrado en la pantalla, eliminando la necesidad de un botón físico y brindando mayor comodidad y seguridad.

Bajo el capó, el iPhone 14 está equipado con un potente procesador A16 Bionic, diseñado específicamente para ofrecer un rendimiento increíblemente rápido y eficiente en el consumo de energía. Esta bestia de procesamiento permite ejecutar aplicaciones y juegos de alta demanda sin esfuerzo, brindando una experiencia fluida y sin interrupciones. En términos de fotografía, el iPhone 14 no decepciona. Cuenta con una cámara principal de alta resolución y múltiples lentes, que combinadas con el avanzado software de procesamiento de imágenes de Apple, capturan fotos y videos de calidad profesional. Además, ofrece una amplia gama de funciones de fotografía, como modo nocturno mejorado, zoom óptico y estabilización de imagen, que permiten a los usuarios explorar su creatividad al máximo. Con su combinación de diseño elegante, rendimiento excepcional y capacidades fotográficas de primer nivel, el iPhone 14 es sin duda un dispositivo que marca un hito en la industria de los teléfonos inteligentes.', 'Pantalla: Super Retina XDR de 6.1 pulgadas, con resolución de 2532 x 1170 píxeles (460 ppi), tecnología OLED, HDR10, Dolby Vision, True Tone y amplia gama de colores (P3).
Procesador: Apple A15 Bionic (seis núcleos, 64 bits) con motor neuronal de 16 núcleos.
Memoria RAM: 6 GB.
Almacenamiento interno: 128 GB, 256 GB o 512 GB (no expandible).
Cámara trasera: Doble cámara de 12 MP:Lente gran angular: Apertura f/1.5, estabilización óptica de imagen (OIS).
Lente ultra gran angular: Apertura f/2.4, campo de visión de 120°.
Grabación de video 4K a 24, 30 o 60 fps, modo Cinemático para video, modo nocturno, Deep Fusion, Smart HDR 4, modo Retrato con control de profundidad.
Cámara frontal: 12 MP, apertura f/1.9, grabación de video 4K a 24, 30 o 60 fps, modo Cinemático para video, modo nocturno, Deep Fusion, Smart HDR 4, slo-mo (Slofies).
Face ID: Reconocimiento facial mediante la cámara TrueDepth para desbloquear el dispositivo, autenticación y pagos.
Batería: Hasta 20 horas de reproducción de video y hasta 80 horas de reproducción de audio.
Conectividad: 5G, 4G LTE Advanced, Wi-Fi 6 (802.11ax) con MIMO, Bluetooth 5.3, NFC (solo para Apple Pay).
Sistema operativo: Originalmente con iOS 16, actualizable a versiones posteriores.
Resistencia al agua y polvo: Certificación IP68 (resistente al agua hasta 6 metros durante 30 minutos).
Carga inalámbrica: Compatible con cargadores Qi y MagSafe.
Carga rápida: Capaz de cargar hasta un 50% en 30 minutos con un cargador de 20 W o superior (no incluido en la caja).
Dimensiones: 146.7 x 71.5 x 7.8 mm.
Peso: 172 gramos.
Materiales: Cristal tanto en la parte delantera como trasera (Ceramic Shield), con bordes de aluminio.
Colores disponibles: Medianoche, estelar, azul, morado, rojo (Product RED) y rosa.
Otros: Altavoces estéreo, soporte para Dolby Atmos, eliminación del conector de auriculares de 3.5 mm, soporte para Dual SIM (Nano SIM y eSIM).
Condición: Semi Nuevo.', '{"Estado": "Seminuevo", "_history": [{"at": 1776371852975, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 420000}, {"at": 1776373193158, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 420000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376403913, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 420000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780085524067, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 456000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 128, "price": 456000, "stock": 1, "oldPrice": 899000}, {"gb": 256, "price": 508000, "stock": 1, "oldPrice": 899000}, {"gb": 512, "price": 551000, "stock": 1, "oldPrice": 899000}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "Medianoche", "Celeste", "Amarillo", "Titanio Blanco", "Ultramarino", "Rojo", "Rosado"]}'::jsonb, '[]'::jsonb, '[{"hex": "#191921", "name": "Medianoche"}, {"hex": "#9ecae1", "name": "Celeste"}, {"hex": "#f4d35e", "name": "Amarillo"}, {"hex": "#e8e8e6", "name": "Titanio Blanco"}, {"hex": "#2f3e5c", "name": "Ultramarino"}, {"hex": "#c0392b", "name": "Rojo"}, {"hex": "#f4b6c2", "name": "Rosado"}]'::jsonb, '["128 GB", "256 GB", "512 GB"]'::jsonb, NULL, true, '2026-04-16 20:37:33.469704+00', '2026-05-29 20:12:04.886574+00'),
('59d50906-e16b-4654-968e-1ac977434099', 'custom-1776373156747', NULL, 'iPhone 17 Air', 'iphone', 'iPhone', 'seminuevo', 800000, 900000, 10, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776373143939-1776373143939-163.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776373143939-1776373143939-163.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776373143939-1776373145885-164.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776373143939-1776373146621-165.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776373143939-1776373147433-166.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776373143939-1776373148227-167.png"]'::jsonb, 'iPhone Air. El iPhone más delgado hasta ahora. Pantalla de 6,5 pulgadas, resistente Ceramic Shield delante y atrás, chip A19 Pro, sistema de cámara Fusion de 48 MP y cámara frontal Center Stage.

SÚPER DELGADO. MEGA LIVIANO. ULTRA RESISTENTE. — El iPhone más delgado. El poder de un chip pro. Con sólo 5,6 mm de grosor, el iPhone Air es tan increíblemente delgado y liviano que parece fundirse con tu mano.
MÁS RESISTENTE QUE CUALQUIER IPHONE ANTERIOR — Marco de titanio ultra liviano con Ceramic Shield que protege la parte trasera del iPhone Air y la vuelve 4 veces más resistente a los golpes. Y el nuevo frente de Ceramic Shield 2, con una resistencia a los rayones 3 veces mayor.
DOS AVANZADAS CÁMARAS EN UNA — Sistema de cámara Fusion de 48 MP con zoom de calidad óptica de 2×. Encuadra la toma perfecta sin moverte ni un paso de donde estés.
CÁMARA FRONTAL CENTER STAGE DE 18 MP — Nuevas posibilidades para encuadrar tus tomas, selfies grupales más inteligentes, video con Captura Dual para grabar con la cámara frontal y las cámaras traseras al mismo tiempo y mucho más.
CHIP A19 PRO. SÚPER VELOZ. SÚPER CAPAZ. — El A19 Pro es el chip de iPhone más eficiente hasta ahora, ya que te ofrece un rendimiento pro en un revolucionario diseño delgado y liviano.
BATERÍA PARA TODO EL DÍA — Batería para todo el día y hasta 27 horas de reproducción de video.
iOS 26. ESTRENANDO LOOK. DERROCHANDO MAGIA. — El nuevo diseño con Liquid Glass se ve increíble y se siente familiar al instante, con una pantalla bloqueada que atrapa miradas, fondos personalizables y encuestas en Mensajes, Revisión de Llamadas y mucho más.
DISEÑADO PARA APPLE INTELLIGENCE — Personal, privado y poderoso. Escribe, exprésate y haz de todo con mucha facilidad.
FUNCIONALIDADES ESENCIALES DE SEGURIDAD — Con Detección de Choques, el iPhone puede detectar si sufres un accidente automovilístico grave y pedir ayuda cuando tú no puedes.7
MEJOR CONECTIVIDAD. GRAN VELOCIDAD. — Sigue en contacto a velocidades más rápidas con conexiones seguras a Wi-Fi 7, redes 5G y Bluetooth 6, y con la eSIM.
eSIM. FLEXIBILIDAD. SEGURIDAD. SIMPLICIDAD. — Con la eSIM, disfrutas una mayor flexibilidad, comodidad y seguridad, además de una gran conectividad, sobre todo cuando viajas a otro país. También te da más seguridad, ya que nadie puede quitarla en caso de robo o pérdida de tu iPhone.
PRIVACIDAD — Un nuevo nivel de privacidad y seguridad integradas.
IMPORTANTE: Este iPhone es compatible exclusivamente con eSIM. No funciona con tarjetas SIM físicas. Contacta a tu operador móvil para conocer cómo activarla.', 'Pantalla: Super Retina XDR display, 6.5-inch (diagonal) all-screen OLED display, resolución 2736 × 1260 at 460 ppi, Dynamic Island, Always-On display, ProMotion up to 120 Hz, HDR display, True Tone, amplia gama de colores (P3), Haptic Touch, contraste típico 2,000,000:1, 1000 nits max typical, 1600 nits HDR peak, 3000 nits outdoor peak.
Procesador: Apple A19 Pro chip with 6-core CPU, 5-core GPU with Neural Accelerators, Neural Engine, high-efficiency architecture.
Memoria RAM: 12 GB.
Almacenamiento interno: 256 GB, 512 GB, 1 TB, no expandible.
Cámara trasera: Cámara de 48 MP Fusion Main rear camera with wide-angle lens, f/1.6 aperture, high-resolution default, Photonic Engine, macro and panorama support.
Cámara frontal: Cámara TrueDepth de 18 MP con Center Stage support, wide-angle lens, estabilización de video, HDR y modos inteligentes de captura.
Face ID: Face ID facial recognition for unlocking, authentication, and Apple Pay.
Batería: Batería integrada de ion-litio recargable (3149 mAh / ~12.26 Wh), MagSafe and Qi 2 wireless charging, USB-C fast charging, all-day battery life estimates.
Conectividad: 5G, Wi-Fi 7 (802.11be), Bluetooth 6.0, Ultra Wideband (UWB), Thread, NFC with reader mode and Express Cards.
Sistema operativo: iOS 26 de fábrica, actualizable a versiones posteriores.
Resistencia al agua y polvo: Certificación IP68 (hasta 6 m de profundidad por 30 minutos).
Carga inalámbrica: Compatible con MagSafe y Qi/ Qi 2 wireless charging standards.
Carga rápida: USB-C fast charging supported (exact wattage per Apple fast-charge specs).
Puerto: USB-C for charging and data transfer (spec details per Apple’s USB-C implementation).
Dimensiones: 156.2 × 74.7 × 5.64 mm.
Peso: 165 grams.
Materiales: Ceramic Shield front and back glass, titanium frame, ultra-thin design.
Colores disponibles: Black (Space Black), Cloud White, Light Gold, Sky Blue (color names vary by region).
Otros: Action Button, Camera Control button, ultra-thin body (5.64 mm), single rear speaker (mono), Dual eSIM support (no physical SIM tray in some regions).
Condición: Semi Nuevo', '{"Estado": "Seminuevo", "_history": [{"at": 1776373156747, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 880000}, {"at": 1776373172494, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 880000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376855906, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 880000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780084226117, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 800000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 256, "price": 800000, "stock": 10, "oldPrice": 900000}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "Negro", "Blanco", "Oro", "Celeste"]}'::jsonb, '[]'::jsonb, '[{"hex": "#1f1f1f", "name": "Negro"}, {"hex": "#f1f1f1", "name": "Blanco"}, {"hex": "#e6c992", "name": "Oro"}, {"hex": "#9ecae1", "name": "Celeste"}]'::jsonb, '["256 GB"]'::jsonb, NULL, true, '2026-04-16 20:59:17.247709+00', '2026-05-29 19:50:28.46349+00'),
('d0ac7884-3258-4251-b3aa-215211ae5d37', 'custom-1776370986771', NULL, 'iPhone 12 Mini', 'iphone', 'iPhone', 'seminuevo', 243000, 579000, 1, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370973381-1776370973382-25.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370973381-1776370973382-25.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370973381-1776370974547-26.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370973381-1776370975146-27.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370973381-1776370975788-28.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370973381-1776370976679-29.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370973381-1776370977352-30.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370973381-1776370978004-31.png"]'::jsonb, 'El iPhone 12 Mini es el teléfono inteligente más compacto de Apple. Este dispositivo cuenta con una pantalla Super Retina XDR de 5,4 pulgadas, con una resolución de 2340 x 1080 píxeles y una densidad de píxeles de 476 ppp, lo que ofrece una calidad de imagen sorprendente en un formato más pequeño. Además, su diseño de vidrio en la parte frontal y trasera, con un marco de aluminio de alta calidad, le da un aspecto elegante y resistente.

El iPhone 12 Mini está equipado con el procesador A14 Bionic de seis núcleos de Apple, lo que garantiza un rendimiento rápido y fluido en todas las aplicaciones y juegos. Además, cuenta con una cámara trasera dual de 12 megapíxeles con un gran angular y un ultra gran angular, lo que permite tomar fotos y videos impresionantes en cualquier situación. También tiene una cámara frontal TrueDepth de 12 megapíxeles con la función de Retina Flash para obtener selfies más naturales en condiciones de poca luz. 

En general, el iPhone 12 Mini es una excelente opción para aquellos usuarios que buscan un teléfono inteligente compacto pero potente con una pantalla de alta calidad y una cámara avanzada.', 'Pantalla: Super Retina XDR de 5.4 pulgadas, con resolución de 2340 x 1080 píxeles (476 ppi), tecnología OLED, HDR10, Dolby Vision, True Tone y amplia gama de colores (P3).
Procesador: Apple A14 Bionic (seis núcleos, 64 bits) con motor neuronal de 16 núcleos.
Memoria RAM: 4 GB.
Almacenamiento interno: 64 GB, 128 GB o 256 GB (no expandible).
Cámara trasera: Doble cámara de 12 MP:Lente gran angular: Apertura f/1.6, estabilización óptica de imagen (OIS).
Lente ultra gran angular: Apertura f/2.4, campo de visión de 120°.
Grabación de video 4K a 24, 30 o 60 fps, modo nocturno, Deep Fusion, Smart HDR 3, modo Retrato con control de profundidad.
Cámara frontal: 12 MP, apertura f/2.2, grabación de video 4K a 24, 30 o 60 fps, modo nocturno, Deep Fusion, Smart HDR 3, slo-mo (Slofies).
Face ID: Reconocimiento facial mediante la cámara TrueDepth para desbloquear el dispositivo, autenticación y pagos.
Batería: 2,227 mAh (no removible), con autonomía de hasta 15 horas en reproducción de video y hasta 50 horas en reproducción de audio.
Conectividad: 5G, 4G LTE Advanced, Wi-Fi 6 (802.11ax) con MIMO, Bluetooth 5.0, NFC (solo para Apple Pay).
Sistema operativo: Originalmente con iOS 14, actualizable a versiones posteriores.
Carga inalámbrica : Compatible con cargadores Qi y MagSafe.
Carga rápida: Capaz de cargar hasta un 50% en 30 minutos con un cargador de 20 W o superior (no incluido en la caja).
Dimensiones: 131.5 x 64.2 x 7.4 mm.
Peso: 135 gramos.
Materiales: Cristal tanto en la parte delantera como trasera (Ceramic Shield), con bordes de aluminio.
Colores disponibles: Negro, blanco, rojo (Product RED), azul, verde y púrpura.
Otros: Altavoces estéreo, soporte para Dolby Atmos, eliminación del conector de auriculares de 3.5 mm, soporte para Dual SIM (Nano SIM y eSIM).', '{"Estado": "Seminuevo", "_history": [{"at": 1776370986771, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 220000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376877600, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 220000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780085891649, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 243000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 64, "price": 243000, "stock": 1, "oldPrice": 579000}, {"gb": 128, "price": 270000, "stock": 0, "oldPrice": null}, {"gb": 256, "price": 310000, "stock": 0, "oldPrice": null}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "Negro", "Blanco", "Rojo", "Verde", "Azul", "Morado"]}'::jsonb, '[]'::jsonb, '[{"hex": "#1f1f1f", "name": "Negro"}, {"hex": "#f1f1f1", "name": "Blanco"}, {"hex": "#c0392b", "name": "Rojo"}, {"hex": "#7aa37a", "name": "Verde"}, {"hex": "#4f6d8a", "name": "Azul"}, {"hex": "#8b6bbd", "name": "Morado"}]'::jsonb, '["64 GB", "128 GB", "256 GB"]'::jsonb, NULL, true, '2026-04-16 20:23:07.558562+00', '2026-05-29 20:18:12.155516+00'),
('f53de6a9-18a9-469e-8feb-829b90577d38', 'custom-1776372885898', NULL, 'iPhone 16 Pro', 'iphone', 'iPhone', 'seminuevo', 930000, 970000, 20, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372875701-1776372875701-132.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372875701-1776372875701-132.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372875701-1776372877153-133.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372875701-1776372878017-134.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372875701-1776372878827-135.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372875701-1776372879510-136.png"]'::jsonb, 'iPhone 16 Pro. Diseñado para Apple Intelligence.1 Imponente diseño de titanio. Control de la Cámara. 4K Dolby Vision a 120 cps. Y el chip A18 Pro.

IMPONENTE DISEÑO DE TITANIO — El iPhone 16 Pro tiene un diseño de titanio resistente y liviano con una pantalla Super Retina XDR más grande, de 6,3 pulgadas.2 Es increíblemente duradero gracias al Ceramic Shield de última generación, que es dos veces más resistente que cualquier vidrio de smartphone.
DISEÑADO CON APPLE INTELLIGENCE EN MENTE — Apple Intelligence es un sistema de inteligencia personal integrado en tu iPhone que te ayuda a escribir, expresarte y hacer de todo con mucha facilidad. Y las avanzadas protecciones de privacidad te dan la tranquilidad de saber que nadie más podrá acceder a tus datos. Ni siquiera Apple. [Apple Intelligence estará disponible en inglés de Estados Unidos a finales de 2024].
CONTROL DE LA CÁMARA — Con esta nueva funcionalidad podrás acceder fácilmente a las herramientas de la cámara, como el zoom o la profundidad de campo, para que no se te escape ni un momento.
CAPTURAS SOÑADAS — La cámara Fusion de 48 MP te permite grabar en 4K Dolby Vision a 120 cps para llevar tus videos a otro nivel. Y con la cámara ultra gran angular de 48 MP, tus fotos macro y panorámicas van a tener un nivel de detalle sorprendente.
ESTILOS FOTOGRÁFICOS — La nueva generación de Estilos Fotográficos te da más libertad creativa para que cada foto tenga tu sello personal. Y gracias a los avances en nuestro procesamiento de imágenes, ahora puedes revertir cualquier estilo en cualquier momento.
LA POTENCIA DEL CHIP A18 PRO — Este chip es el genio detrás de Apple Intelligence, gracias a su Neural Engine más rápido, su CPU y su GPU mejoradas, y un gran salto en el ancho de banda de memoria. También te permite disfrutar funcionalidades avanzadas de foto y video, y juegos AAA.
UN SALTO ENORME EN BATERÍA — El iPhone 16 Pro es tan potente y eficiente que puede ofrecerte hasta 27 horas de reproducción de video. Acopla un cargador MagSafe para obtener una carga inalámbrica más rápida o carga a través de la entrada USB-C.
PERSONALIZA TU IPHONE — Con iOS 18 puedes cambiar el color de los íconos de la pantalla de inicio a tu gusto. Encuentra tus tomas favoritas en un flash en la rediseñada app Fotos. Y agrega divertidos efectos animados a cualquier palabra, frase o emoji en iMessage.
FUNCIONALIDADES ESENCIALES DE SEGURIDAD — Con Detección de Choques, el iPhone puede detectar si sufres un accidente automovilístico grave y pedir ayuda cuando tú no puedes.', '• Pantalla: Super Retina XDR de 6.3 pulgadas, resolución 2622 × 1206 píxeles (460 ppi), tecnología OLED, HDR, True Tone, amplia gama de colores (P3), ProMotion hasta 120 Hz, pantalla siempre activa, Dynamic Island.

• Procesador: Apple A18 Pro, CPU de 6 núcleos, arquitectura de 64 bits, Neural Engine de 16 núcleos.

• Memoria RAM: 8GB RAM.

• Almacenamiento interno: 128 GB, 256 GB, 512 GB, 1 TB, no expandible.

• Cámara trasera: Sistema de triple cámara, cámara principal de 48 MP con apertura f/1.78 y estabilización óptica por desplazamiento del sensor, cámara ultra gran angular de 48 MP con apertura f/2.2 y campo de visión de 120° con fotografía macro, cámara teleobjetivo de 12 MP con apertura f/2.8 y zoom óptico 5× (tetraprisma), fotos espaciales, video espacial, grabación de video 4K a 24, 30 o 60 fps, grabación 4K a 120 fps, HDR con Dolby Vision, Apple ProRes, grabación Log, modo Cinemático, modo Acción, modo Noche, Deep Fusion, Smart HDR.

• Cámara frontal: Cámara TrueDepth de 12 MP con apertura f/1.9, grabación de video 4K a 24, 30 o 60 fps, HDR con Dolby Vision, modo Cinemático, modo Noche, Deep Fusion, Smart HDR, Slofies.

• Face ID: Reconocimiento facial mediante el sistema TrueDepth para desbloqueo del dispositivo, autenticación y pagos.

• Batería: Hasta 27 horas de reproducción de video, hasta 85 horas de reproducción de audio.

• Conectividad: 5G, Wi-Fi 7 (802.11be), Bluetooth 5.3, NFC para Apple Pay.

• Sistema operativo: iOS 18 de fábrica, actualizable a versiones posteriores.

• Resistencia al agua y polvo: Certificación IP68, resistente al agua hasta 6 metros durante un máximo de 30 minutos.

• Carga inalámbrica: Compatible con MagSafe y cargadores Qi.

• Carga rápida: Hasta un 50% de carga en aproximadamente 30 minutos con un adaptador de 20 W o superior, cargador no incluido.

• Puerto: USB-C con soporte para USB 3 (hasta 10 Gb/s) para carga y transferencia de datos.

• Dimensiones: 149.6 × 71.5 × 8.25 mm.

• Peso: 199 gramos.

• Materiales: Parte frontal con Ceramic Shield, parte trasera de vidrio, marco de titanio grado 5.

• Colores disponibles: Negro titanio, blanco titanio, titanio natural, titanio desierto.

• Otros: Botón de Acción personalizable, botón Camera Control dedicado para fotografía y video, altavoces estéreo con soporte para Dolby Atmos, Dual SIM (Nano-SIM y eSIM, según región), sin conector de auriculares de 3.5 mm.

Condición: Semi Nuevo', '{"Estado": "Seminuevo", "_history": [{"at": 1776372885897, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 870000}, {"at": 1776373175787, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 870000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376777430, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 870000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780084824207, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 930000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 128, "price": 931000, "stock": 10, "oldPrice": 100000}, {"gb": 256, "price": 930000, "stock": 10, "oldPrice": 970000}, {"gb": 512, "price": 970000, "stock": 0, "oldPrice": null}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "Gris Espacial", "Blanco", "Titanio Del Desierto", "Titanio Natural"]}'::jsonb, '[]'::jsonb, '[{"hex": "#4a4a4a", "name": "Gris Espacial"}, {"hex": "#f1f1f1", "name": "Blanco"}, {"hex": "#c4a57a", "name": "Titanio Del Desierto"}, {"hex": "#b9b3a9", "name": "Titanio Natural"}]'::jsonb, '["128 GB", "256 GB", "512 GB"]'::jsonb, NULL, true, '2026-04-16 20:54:46.462124+00', '2026-05-29 20:00:24.766822+00'),
('ca4a2de4-55e3-4262-ac95-f05f8c4ddd07', 'custom-1776372052491', NULL, 'iPhone 14 Pro', 'iphone', 'iPhone', 'seminuevo', 636000, 1200000, 20, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372041470-1776372041470-82.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372041470-1776372041470-82.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372041470-1776372043342-83.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372041470-1776372044073-84.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372041470-1776372044749-85.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372041470-1776372045339-86.png"]'::jsonb, 'El iPhone 14 Pro es la joya de la corona de Apple, diseñado para satisfacer las necesidades más exigentes de los usuarios. Con un cuerpo elegante y resistente de acero inoxidable, este dispositivo emana lujo y sofisticación. Su pantalla ProMotion OLED de alta resolución y alta frecuencia de actualización ofrece una experiencia visual inigualable, con colores vibrantes, negros profundos y una fluidez excepcional. Además, cuenta con tecnología ProMotion adaptable que ajusta automáticamente la frecuencia de actualización según el contenido mostrado, lo que brinda una experiencia más inmersiva y ahorra energía.

En cuanto a rendimiento, el iPhone 14 Pro está equipado con el poderoso chip A16 Bionic de Apple, que ofrece un rendimiento líder en la industria. Ya sea para ejecutar aplicaciones exigentes, jugar a juegos de alta calidad o editar contenido multimedia, este dispositivo no se queda atrás. Además, cuenta con una configuración de triple cámara de última generación que incluye un sensor principal de alta resolución, un ultra gran angular y un teleobjetivo, lo que permite capturar imágenes asombrosas con gran detalle y versatilidad. Además, ofrece capacidades de grabación de video de nivel profesional, con soporte para grabación en Dolby Vision y capacidades de edición avanzadas. Con todas estas características y más, el iPhone 14 Pro se posiciona como uno de los teléfonos inteligentes más potentes y versátiles del mercado.', 'Pantalla: Super Retina XDR de 6.1 pulgadas, con resolución de 2556 x 1179 píxeles (460 ppi), tecnología OLED, HDR10, Dolby Vision, True Tone y amplia gama de colores (P3). Soporta ProMotion con una tasa de refresco adaptativa de hasta 120 Hz.
Procesador: Apple A16 Bionic (seis núcleos, 64 bits) con motor neuronal de 16 núcleos.
Memoria RAM: 6 GB.
Almacenamiento interno: 128 GB, 256 GB, 512 GB o 1 TB (no expandible).
Cámara trasera: Sistema de triple cámara de 48 MP:Lente gran angular: 48 MP con apertura f/1.78, estabilización óptica de imagen (OIS).
Lente ultra gran angular: 12 MP con apertura f/2.2, campo de visión de 120°.
Lente teleobjetivo: 12 MP con apertura f/2.8, estabilización óptica de imagen (OIS), zoom óptico 3x.
Sensor LiDAR: Mejora el enfoque automático en condiciones de poca luz y permite capacidades avanzadas de realidad aumentada (AR).
Grabación de video 4K a 24, 30 o 60 fps, Dolby Vision HDR en grabación, modo Cinemático para video, modo nocturno, Deep Fusion, Smart HDR 4, modo Retrato con control de profundidad.
Cámara frontal: 12 MP, apertura f/1.9, grabación de video 4K a 24, 30 o 60 fps, modo Cinemático para video, modo nocturno, Deep Fusion, Smart HDR 4, slo-mo (Slofies).
Face ID: Reconocimiento facial mediante la cámara TrueDepth para desbloquear el dispositivo, autenticación y pagos.
Batería: Hasta 23 horas de reproducción de video y hasta 75 horas de reproducción de audio.
Conectividad: 5G, 4G LTE Advanced, Wi-Fi 6 (802.11ax) con MIMO, Bluetooth 5.3, NFC (solo para Apple Pay).
Sistema operativo: Originalmente con iOS 16, actualizable a versiones posteriores.
Resistencia al agua y polvo: Certificación IP68 (resistente al agua hasta 6 metros durante 30 minutos).
Carga inalámbrica: Compatible con cargadores Qi y MagSafe.
Carga rápida: Capaz de cargar hasta un 50% en 30 minutos con un cargador de 20 W o superior (no incluido en la caja).
Dimensiones: 147.5 x 71.5 x 7.85 mm.
Peso: 206 gramos.
Materiales: Cristal Ceramic Shield en la parte delantera, cristal texturizado en la parte trasera, con bordes de acero inoxidable.
Colores disponibles: Gris espacial, plata, dorado y morado.
Otros: Altavoces estéreo con soporte para Dolby Atmos, eliminación del conector de auriculares de 3.5 mm, soporte para Dual SIM (Nano SIM y eSIM).
Condición: Semi Nuevo.', '{"Estado": "Seminuevo", "_history": [{"at": 1776372052491, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 590000}, {"at": 1776373191924, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 590000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376464205, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 590000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780085372179, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 636000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780085400817, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 636000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 128, "price": 636000, "stock": 10, "oldPrice": 1200000}, {"gb": 256, "price": 689000, "stock": 10, "oldPrice": 1100000}, {"gb": 512, "price": 690000, "stock": 0, "oldPrice": null}, {"gb": 1000, "price": 750000, "stock": 0, "oldPrice": null}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "Blanco", "Oro", "Púrpura", "Medianoche"]}'::jsonb, '[]'::jsonb, '[{"hex": "#f1f1f1", "name": "Blanco"}, {"hex": "#e6c992", "name": "Oro"}, {"hex": "#8b6bbd", "name": "Púrpura"}, {"hex": "#191921", "name": "Medianoche"}]'::jsonb, '["128 GB", "256 GB", "512 GB", "1000 GB"]'::jsonb, NULL, true, '2026-04-16 20:40:53.225468+00', '2026-05-29 20:10:01.199983+00'),
('a7491aa5-2c1f-4664-9aa2-338e0bd409f7', 'custom-1776371146841', NULL, 'iPhone 12 Pro Max', 'iphone', 'iPhone', 'seminuevo', 488000, 849000, 1, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371124358-1776371124358-37.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371124358-1776371124358-37.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371124358-1776371126352-38.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371124358-1776371127049-39.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371124358-1776371127707-40.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371124358-1776371128404-41.png"]'::jsonb, 'El iPhone 12 Pro Max es la versión más grande y avanzada de la línea iPhone 12 de Apple. Con una pantalla Super Retina XDR de 6.7 pulgadas, el dispositivo ofrece una experiencia de visualización envolvente con colores vibrantes y detalles impresionantes. Además, cuenta con un sistema de cámara triple de 12 megapíxeles con tecnología LiDAR, que permite tomar fotos y videos con calidad profesional incluso en condiciones de poca luz. La cámara también tiene la capacidad de grabar videos en calidad Dolby Vision HDR, lo que hace que las grabaciones sean aún más impresionantes.

El iPhone 12 Pro Max también cuenta con la conectividad 5G, lo que significa que podrás navegar por la web, descargar aplicaciones y transmitir videos a velocidades increíblemente rápidas. Con una capacidad de almacenamiento de hasta 512 GB, tendrás suficiente espacio para almacenar todas tus fotos, videos y aplicaciones favoritas. Además, el dispositivo cuenta con una batería duradera y la capacidad de carga rápida inalámbrica, lo que significa que podrás disfrutar del dispositivo durante todo el día sin preocuparte por quedarte sin energía. 

En resumen, el iPhone 12 Pro Max es una opción ideal para aquellos que buscan un dispositivo móvil de alta calidad con características avanzadas y una experiencia de usuario inigualable.', 'Pantalla: Super Retina XDR de 6.7 pulgadas, con resolución de 2778 x 1284 píxeles (458 ppi), tecnología OLED, HDR10, Dolby Vision, True Tone y amplia gama de colores (P3).
Procesador: Apple A14 Bionic (seis núcleos, 64 bits) con motor neuronal de 16 núcleos.
Memoria RAM: 6 GB.
Almacenamiento interno: 128 GB, 256 GB o 512 GB (no expandible).
Cámara trasera: Sistema de triple cámara de 12 MP:Lente gran angular: Apertura f/1.6, estabilización óptica de imagen (OIS).
Lente ultra gran angular: Apertura f/2.4, campo de visión de 120°.
Lente teleobjetivo: Apertura f/2.2, estabilización óptica de imagen (OIS), zoom óptico 2.5x.
Sensor LiDAR: Mejora el enfoque automático en condiciones de poca luz y permite capacidades avanzadas de realidad aumentada (AR).
Grabación de video 4K a 24, 30 o 60 fps, Dolby Vision HDR en grabación, modo nocturno, Deep Fusion, Smart HDR 3, modo Retrato con control de profundidad, iluminación de retrato.
Cámara frontal: 12 MP, apertura f/2.2, grabación de video 4K a 24, 30 o 60 fps, modo nocturno, Deep Fusion, Smart HDR 3, slo-mo (Slofies).
Face ID: Reconocimiento facial mediante la cámara TrueDepth para desbloquear el dispositivo, autenticación y pagos.
Batería: 3,687 mAh (no removible), con autonomía de hasta 20 horas en reproducción de video y hasta 80 horas en reproducción de audio.
Conectividad: 5G, 4G LTE Advanced, Wi-Fi 6 (802.11ax) con MIMO, Bluetooth 5.0, NFC (solo para Apple Pay).
Sistema operativo: Originalmente con iOS 14, actualizable a versiones posteriores.
Carga inalámbrica: Compatible con cargadores Qi y MagSafe.
Carga rápida: Capaz de cargar hasta un 50% en 30 minutos con un cargador de 20 W o superior (no incluido en la caja).
Dimensiones: 160.8 x 78.1 x 7.4 mm.
Peso: 228 gramos.
Materiales: Cristal Ceramics Shield en la parte delantera, cristal texturizado en la parte trasera, con bordes de acero inoxidable.
Colores disponibles: Gris pacífico, plata, oro y azul pacífico.
Otros: Altavoces estéreo con soporte para Dolby Atmos, eliminación del conector de auriculares de 3.5 mm, soporte para Dual SIM (Nano SIM y eSIM).', '{"Estado": "Seminuevo", "_history": [{"at": 1776371146841, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 400000}, {"at": 1776373196756, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 400000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376123045, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 400000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376134718, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 400000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780085744689, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 488000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 128, "price": 488000, "stock": 0, "oldPrice": 849000}, {"gb": 256, "price": 488000, "stock": 1, "oldPrice": 849000}, {"gb": 512, "price": 490000, "stock": 0, "oldPrice": null}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "Blanco", "Titanio Natural", "Oro", "Azul"]}'::jsonb, '[]'::jsonb, '[{"hex": "#f1f1f1", "name": "Blanco"}, {"hex": "#b9b3a9", "name": "Titanio Natural"}, {"hex": "#e6c992", "name": "Oro"}, {"hex": "#4f6d8a", "name": "Azul"}]'::jsonb, '["128 GB", "256 GB", "512 GB"]'::jsonb, NULL, true, '2026-04-16 20:25:47.459954+00', '2026-05-29 20:15:45.371201+00'),
('3bed78a3-2131-44fa-9e8e-578195c9dbda', 'custom-1776370228149', NULL, 'IPhone 11', 'iphone', 'iPhone', 'seminuevo', 180000, 300000, 0, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370216513-1776370216513-2.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370216513-1776370216513-2.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370216513-1776370217101-3.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370216513-1776370217650-4.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370216513-1776370218218-5.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370216513-1776370218813-6.png"]'::jsonb, 'Condición: Semi Nuevo
El iPhone 11 sigue siendo una opción confiable dentro del ecosistema Apple. Ofrece una pantalla LCD Liquid Retina de 6,1 pulgadas con excelente respuesta táctil y colores vivos, ideal para quienes valoran una experiencia fluida sin necesidad de los modelos más nuevos.

Su doble cámara permite tomar retratos con efecto de profundidad y grabar videos en alta calidad, mientras que el chip A13 Bionic garantiza buen rendimiento para las tareas diarias y apps más comunes. Este equipo reacondicionado ha sido revisado y probado para funcionar correctamente, representando una buena alternativa para quienes buscan calidad Apple a un precio más accesible.

Una elección práctica si buscas buen desempeño, cámaras sólidas y una pantalla grande sin llegar al precio de los modelos más recientes.', 'Pantalla: Liquid Retina HD de 6.1 pulgadas, con resolución de 1792 x 828 píxeles (326 ppi), tecnología LCD IPS, True Tone y amplia gama de colores (P3).
Procesador: Apple A13 Bionic (seis núcleos, 64 bits) con motor neuronal de tercera generación.
Memoria: RAM4 GB.
Almacenamiento interno: 64 GB, 128 GB o 256 GB (no expandible).
Cámara trasera: Doble cámara de 12 MP:Lente gran angular: Apertura f/1.8, estabilización óptica de imagen (OIS).
Lente ultra gran angular: Apertura f/2.4, campo de visión de 120°.
Grabación de video 4K a 24, 30 o 60 fps, modo nocturno, Smart HDR, modo Retrato con control de profundidad, iluminación de retrato.
Cámara frontal: 12 MP, apertura f/2.2, grabación de video 4K a 24, 30 o 60 fps, modo Retrato, Smart HDR, slo-mo (Slofies).
Face ID: Reconocimiento facial mediante la cámara TrueDepth para desbloquear el dispositivo, autenticación y pagos.
Batería: 3,110 mAh (no removible), con autonomía de hasta 17 horas en reproducción de video y hasta 65 horas en reproducción de audio.
Conectividad: 4G LTE Advanced, Wi-Fi 6 (802.11ax) con MIMO, Bluetooth 5.0, NFC (solo para Apple Pay).
Sistema operativo: Originalmente con iOS 13, actualizable a versiones posteriores.
Carga inalámbrica: Compatible con cargadores Qi.
Carga rápidaCapaz de cargar hasta un 50% en 30 minutos con un cargador de 18 W o superior (no incluido en la caja).
Dimensiones: 150.9 x 75.7 x 8.3 mm.
Peso: 194 gramos.
Materiales: Cristal tanto en la parte delantera como trasera, con bordes de aluminio.
Colores disponibles: Negro, blanco, rojo (Product RED), verde, amarillo y púrpura.OtrosAltavoces estéreo, soporte para Dolby Atmos, eliminación del conector de auriculares de 3.5 mm, soporte para Dual SIM (Nano SIM y eSIM).
Condición: Semi Nuevo.', '{"Estado": "Seminuevo", "_history": [{"at": 1776377011338, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 180000}, {"at": 1776370254912, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 180000}, {"at": 1776370228148, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 180000}, {"at": 1777066309860, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 180000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780085996024, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 180000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 64, "price": 180000, "stock": 0, "oldPrice": 300000}, {"gb": 128, "price": 250000, "stock": 0, "oldPrice": 4000000}, {"gb": 256, "price": 290000, "stock": 0, "oldPrice": 450000}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["Verde", "Amarillo", "Medianoche", "Blanco", "Rojo"]}'::jsonb, '[]'::jsonb, '[{"hex": "#7aa37a", "name": "Verde"}, {"hex": "#f4d35e", "name": "Amarillo"}, {"hex": "#191921", "name": "Medianoche"}, {"hex": "#f1f1f1", "name": "Blanco"}, {"hex": "#c0392b", "name": "Rojo"}]'::jsonb, '["64 GB", "128 GB", "256 GB"]'::jsonb, NULL, true, '2026-04-16 20:10:30.00712+00', '2026-05-29 20:19:56.484777+00'),
('d80dcddc-ab81-4b2b-8f8b-9df0088ad92e', 'custom-1776371958619', NULL, 'iPhone 14 Plus', 'iphone', 'iPhone', 'seminuevo', 460000, NULL, 2, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371949591-1776371949591-75.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371949591-1776371949591-75.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371925960-1776371928041-76.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371925960-1776371928602-77.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371925960-1776371929364-78.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371925960-1776371930121-79.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371925960-1776371930836-80.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371925960-1776371931516-81.png"]'::jsonb, 'El iPhone 14 Plus es la última incorporación a la exitosa línea de teléfonos inteligentes de Apple. Diseñado para combinar una estética elegante con un rendimiento excepcional, el iPhone 14 Plus ofrece una experiencia de usuario inigualable. Con una pantalla OLED de alta resolución de 6.7 pulgadas, los colores se ven vibrantes y los detalles son nítidos, lo que hace que sea un placer ver contenido multimedia y navegar por aplicaciones. Además, cuenta con una potente cámara trasera triple de 12 megapíxeles que captura imágenes impresionantes con gran detalle y claridad. Ya sea que estés tomando fotos en condiciones de poca luz o grabando videos en resolución 4K, el iPhone 14 Plus garantiza resultados de alta calidad.

El iPhone 14 Plus cuenta con el potente chip A16 de Apple, que proporciona un rendimiento rápido y eficiente en todas las tareas. Desde el uso de aplicaciones intensivas hasta la multitarea sin problemas, este dispositivo maneja todo con facilidad. Además, viene con una generosa capacidad de almacenamiento interno, lo que significa que puedes almacenar todos tus archivos, fotos y videos sin preocuparte por quedarte sin espacio. El iPhone 14 Plus también incluye una batería de larga duración que te permite disfrutar de tu teléfono durante todo el día sin tener que preocuparte por quedarte sin energía. Con su elegante diseño, pantalla impresionante y potente rendimiento, el iPhone 14 Plus es una opción perfecta para aquellos que buscan lo último en tecnología móvil.', 'Pantalla: Super Retina XDR de 6.7 pulgadas, con resolución de 2796 x 1290 píxeles (458 ppi), tecnología OLED, HDR10, Dolby Vision, True Tone y amplia gama de colores (P3).
Procesador: Apple A15 Bionic (seis núcleos, 64 bits) con motor neuronal de 16 núcleos.
Memoria RAM: 6 GB.
Almacenamiento interno: 128 GB, 256 GB o 512 GB (no expandible).
Cámara trasera: Doble cámara de 12 MP:Lente gran angular: Apertura f/1.5, estabilización óptica de imagen (OIS).
Lente ultra gran angular Apertura f/2.4, campo de visión de 120°.
Grabación de video 4K a 24, 30 o 60 fps, modo Cinemático para video, modo nocturno, Deep Fusion, Smart HDR 4, modo Retrato con control de profundidad.
Cámara frontal: 12 MP, apertura f/1.9, grabación de video 4K a 24, 30 o 60 fps, modo Cinemático para video, modo nocturno, Deep Fusion, Smart HDR 4, slo-mo (Slofies).
Face ID: Reconocimiento facial mediante la cámara TrueDepth para desbloquear el dispositivo, autenticación y pagos.
Batería: Hasta 26 horas de reproducción de video y hasta 100 horas de reproducción de audio.
Conectividad: 5G, 4G LTE Advanced, Wi-Fi 6 (802.11ax) con MIMO, Bluetooth 5.3, NFC (solo para Apple Pay).
Sistema operativo: Originalmente con iOS 16, actualizable a versiones posteriores.
Resistencia al agua y polvo: Certificación IP68 (resistente al agua hasta 6 metros durante 30 minutos).
Carga inalámbrica: Compatible con cargadores Qi y MagSafe.
Carga rápida: Capaz de cargar hasta un 50% en 30 minutos con un cargador de 20 W o superior (no incluido en la caja).
Dimensiones: 160.8 x 78.1 x 7.8 mm.
Peso: 203 gramos.
Materiales: Cristal tanto en la parte delantera como trasera (Ceramic Shield), con bordes de aluminio.
Colores disponibles: Medianoche, estelar, azul, morado, rojo (Product RED) y rosa.
Otros: Altavoces estéreo, soporte para Dolby Atmos, eliminación del conector de auriculares de 3.5 mm, soporte para Dual SIM (Nano SIM y eSIM).
Condición: Semi Nuevo.', '{"Estado": "Seminuevo", "_history": [{"at": 1776371958619, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 460000}, {"at": 1776373192528, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 460000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376439625, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 460000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780085455358, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 460000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 128, "price": 460000, "stock": 0, "oldPrice": null}, {"gb": 256, "price": 551000, "stock": 1, "oldPrice": 1099000}, {"gb": 512, "price": 604000, "stock": 1, "oldPrice": 1100000}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "Negro", "Blanco", "Plata", "Rojo", "Celeste", "Amarillo"]}'::jsonb, '[]'::jsonb, '[{"hex": "#1f1f1f", "name": "Negro"}, {"hex": "#f1f1f1", "name": "Blanco"}, {"hex": "#c0c0c0", "name": "Plata"}, {"hex": "#c0392b", "name": "Rojo"}, {"hex": "#9ecae1", "name": "Celeste"}, {"hex": "#f4d35e", "name": "Amarillo"}]'::jsonb, '["128 GB", "256 GB", "512 GB"]'::jsonb, NULL, true, '2026-04-16 20:39:19.691249+00', '2026-05-29 20:10:55.970028+00'),
('85614354-57bb-4271-a2ad-2cec09c0feae', 'custom-1776371560566', NULL, 'iPhone 13 Pro', 'iphone', 'iPhone', 'seminuevo', 530000, 990000, 10, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371501327-1776371501327-56.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371501327-1776371501327-56.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371501327-1776371502610-57.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371501327-1776371503249-58.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371501327-1776371504584-59.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371501327-1776371505732-61.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371555461-1776371555461-60.png"]'::jsonb, 'El iPhone 13 Pro es el modelo de gama alta de Apple en la línea de dispositivos móviles. Con una pantalla Super Retina XDR de 6.1 pulgadas, el dispositivo ofrece una experiencia de visualización impresionante con colores vibrantes y detalles nítidos. Además, cuenta con un sistema de cámara triple de 12 megapíxeles con tecnología de estabilización óptica de imagen, que te permite tomar fotos y videos con calidad profesional incluso en condiciones de poca luz. La cámara también tiene la capacidad de grabar videos en calidad 4K a 60 cuadros por segundo y cuenta con nuevas características, como el modo de fotografía ProRAW y el modo de video ProRes, que brindan más opciones de edición y un mayor control creativo.

El iPhone 13 Pro también cuenta con el chip A15 Bionic, el chip más rápido en un smartphone hasta el momento, que permite un rendimiento increíblemente rápido y eficiente. Además, el dispositivo cuenta con conectividad 5G, lo que te permite navegar por la web, descargar aplicaciones y transmitir videos a velocidades extremadamente rápidas. El dispositivo también cuenta con una batería duradera y la capacidad de carga rápida inalámbrica, lo que significa que podrás disfrutar del dispositivo durante todo el día sin preocuparte por quedarte sin energía. 

En general, el iPhone 13 Pro es una excelente opción para aquellos que buscan un dispositivo móvil de alta calidad con características avanzadas y una experiencia de usuario inigualable para la creación de contenido profesional.', 'Pantalla: Super Retina XDR de 6.1 pulgadas, con resolución de 2532 x 1170 píxeles (460 ppi), tecnología OLED, HDR10, Dolby Vision, True Tone y amplia gama de colores (P3). Soporta ProMotion con una tasa de refresco adaptativa de hasta 120 Hz.
Procesador: Apple A15 Bionic (seis núcleos, 64 bits) con motor neuronal de 16 núcleos.
Memoria RAM: 6 GB.
Almacenamiento interno: 128 GB, 256 GB, 512 GB o 1 TB (no expandible).
Cámara trasera: Sistema de triple cámara de 12 MP:Lente gran angular: Apertura f/1.5, estabilización óptica de imagen (OIS).
Lente ultra gran angular: Apertura f/1.8, campo de visión de 120°.
Lente teleobjetivo: Apertura f/2.8, estabilización óptica de imagen (OIS), zoom óptico 3x.
Sensor LiDAR: Mejora el enfoque automático en condiciones de poca luz y permite capacidades avanzadas de realidad aumentada (AR).
Grabación de video 4K a 24, 30 o 60 fps, Dolby Vision HDR en grabación, modo Cinemático para video, modo nocturno, Deep Fusion, Smart HDR 4, modo Retrato con control de profundidad, iluminación de retrato.
Cámara frontal: 12 MP, apertura f/2.2, grabación de video 4K a 24, 30 o 60 fps, modo Cinemático para video, modo nocturno, Deep Fusion, Smart HDR 4, slo-mo (Slofies).
Face ID: Reconocimiento facial mediante la cámara TrueDepth para desbloquear el dispositivo, autenticación y pagos.
Batería: 3,095 mAh (no removible), con autonomía de hasta 22 horas en reproducción de video y hasta 75 horas en reproducción de audio.
Conectividad: 5G, 4G LTE Advanced, Wi-Fi 6 (802.11ax) con MIMO, Bluetooth 5.0, NFC (solo para Apple Pay).
Sistema operativo: Originalmente con iOS 15, actualizable a versiones posteriores.
Carga inalámbrica: Compatible con cargadores Qi y MagSafe.
Carga rápida: Capaz de cargar hasta un 50% en 30 minutos con un cargador de 20 W o superior (no incluido en la caja).
Dimensiones: 146.7 x 71.5 x 7.65 mm.
Peso: 204 gramos.
Materiales: Cristal Ceramics Shield en la parte delantera, cristal texturizado en la parte trasera, con bordes de acero inoxidable.
Colores disponibles: Grafito, plata, oro y azul sierra.
Otros: Altavoces estéreo con soporte para Dolby Atmos, eliminación del conector de auriculares de 3.5 mm, soporte para Dual SIM (Nano SIM y eSIM).
Condición: Semi Nuevo.', '{"Estado": "Seminuevo", "_history": [{"at": 1776371560566, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 490000}, {"at": 1776373195339, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 490000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376255665, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 490000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780085618536, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 530000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 128, "price": 530000, "stock": 10, "oldPrice": 990000}, {"gb": 256, "price": 530000, "stock": 0, "oldPrice": null}, {"gb": 512, "price": 570000, "stock": 0, "oldPrice": null}, {"gb": 1024, "price": 620000, "stock": 0, "oldPrice": null}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "Blanco", "Gris Espacial", "Oro", "Verde Alpino", "Sierra Azul"]}'::jsonb, '[]'::jsonb, '[{"hex": "#f1f1f1", "name": "Blanco"}, {"hex": "#4a4a4a", "name": "Gris Espacial"}, {"hex": "#e6c992", "name": "Oro"}, {"hex": "#4a5d4a", "name": "Verde Alpino"}, {"hex": "#9eb5cb", "name": "Sierra Azul"}]'::jsonb, '["128 GB", "256 GB", "512 GB", "1 TB"]'::jsonb, NULL, true, '2026-04-16 20:32:41.311927+00', '2026-05-29 20:13:38.99796+00'),
('3a4f2d52-150b-4e2b-9ca6-b12ab3c3f5e7', 'custom-1776370633527', NULL, 'iPhone 12', 'iphone', 'iPhone', 'seminuevo', 260000, 550000, 1, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370621769-1776370621769-17.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370621769-1776370621769-17.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370621769-1776370624238-18.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370621769-1776370625002-19.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370621769-1776370625634-20.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370621769-1776370626292-21.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370621769-1776370626966-22.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370621769-1776370627619-23.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370621769-1776370628166-24.png"]'::jsonb, 'El iPhone 12 es uno de los últimos modelos de teléfonos inteligentes de Apple. Este dispositivo cuenta con una pantalla Super Retina XDR de 6,1 pulgadas, con una resolución de 2532 x 1170 píxeles y una densidad de píxeles de 460 ppp, lo que ofrece una calidad de imagen impresionante con colores vibrantes y negros profundos. Además, su diseño de vidrio en la parte frontal y trasera, con un marco de aluminio de alta calidad, le da un aspecto elegante y resistente.

El iPhone 12 está equipado con el procesador A14 Bionic de seis núcleos de Apple, lo que garantiza un rendimiento rápido y fluido en todas las aplicaciones y juegos. Además, cuenta con una cámara trasera dual de 12 megapíxeles con un gran angular y un ultra gran angular, lo que permite tomar fotos y videos impresionantes en cualquier situación. También tiene una cámara frontal TrueDepth de 12 megapíxeles con la función de Retina Flash para obtener selfies más naturales en condiciones de poca luz. 

En general, el iPhone 12 es una excelente opción para aquellos usuarios que buscan un teléfono inteligente de gama alta con una pantalla de alta calidad, un rendimiento excepcional y una cámara avanzada.', 'Pantalla: Super Retina XDR de 6.1 pulgadas, con resolución de 2532 x 1170 píxeles (460 ppi), tecnología OLED, HDR10, Dolby Vision, True Tone y amplia gama de colores (P3).
Procesador: Apple A14 Bionic (seis núcleos, 64 bits) con motor neuronal de 16 núcleos.
Memoria RAM4 GB.
Almacenamiento interno 64 GB, 128 GB o 256 GB (no expandible).
Cámara trasera: Doble cámara de 12 MP:Lente gran angular: Apertura f/1.6, estabilización óptica de imagen (OIS).
Lente ultra gran angular: Apertura f/2.4, campo de visión de 120°.
Grabación de video 4K a 24, 30 o 60 fps, modo nocturno, Deep Fusion, Smart HDR 3, modo Retrato con control de profundidad.
Cámara frontal: 12 MP, apertura f/2.2, grabación de video 4K a 24, 30 o 60 fps, modo nocturno, Deep Fusion, Smart HDR 3, slo-mo (Slofies).
Face ID: Reconocimiento facial mediante la cámara TrueDepth para desbloquear el dispositivo, autenticación y pagos.
Batería: 2,815 mAh (no removible), con autonomía de hasta 17 horas en reproducción de video y hasta 65 horas en reproducción de audio.
Conectividad: 5G, 4G LTE Advanced, Wi-Fi 6 (802.11ax) con MIMO, Bluetooth 5.0, NFC (solo para Apple Pay).
Sistema operativo: Originalmente con iOS 14, actualizable a versiones posteriores.
Carga inalámbrica: Compatible con cargadores Qi y MagSafe.
Carga rápida: Capaz de cargar hasta un 50% en 30 minutos con un cargador de 20 W o superior (no incluido en la caja).
Dimensiones: 146.7 x 71.5 x 7.4 mm.
Peso: 164 gramos.
Materiales: Cristal tanto en la parte delantera como trasera (Ceramic Shield), con bordes de aluminio.
Colores disponibles: Negro, blanco, rojo (Product RED), azul, verde y púrpura.
Otros: Altavoces estéreo, soporte para Dolby Atmos, eliminación del conector de auriculares de 3.5 mm, soporte para Dual SIM (Nano SIM y eSIM).
Condición: Semi Nuevo.', '{"Estado": "Seminuevo", "_history": [{"at": 1776370633526, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 250000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376957891, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 250000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780085915885, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 260000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 64, "price": 260000, "stock": 1, "oldPrice": 550000}, {"gb": 128, "price": 300000, "stock": 0, "oldPrice": null}, {"gb": 256, "price": 350000, "stock": 0, "oldPrice": null}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "", "", "", "", "", "", ""]}'::jsonb, '[]'::jsonb, '[{"hex": "#3a3a3c", "name": "Titanio Negro"}, {"hex": "#f1f1f1", "name": "Blanco"}, {"hex": "#c0392b", "name": "Rojo"}, {"hex": "#7aa37a", "name": "Verde"}, {"hex": "#4f6d8a", "name": "Azul"}, {"hex": "#8b6bbd", "name": "Púrpura"}]'::jsonb, '["64 GB", "128 GB", "256 GB"]'::jsonb, NULL, true, '2026-04-16 20:17:14.298697+00', '2026-05-29 20:18:36.516086+00'),
('5e47e427-4184-4fd0-ac3c-f73962118a3f', 'custom-1776370877891', NULL, 'iPhone 12 Pro', 'iphone', 'iPhone', 'seminuevo', 370000, 780000, 1, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370867401-1776370868527-32.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370867401-1776370868527-32.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370867401-1776370867401-36.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370867401-1776370869376-33.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370867401-1776370870003-34.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370867401-1776370870636-35.png"]'::jsonb, 'El iPhone 12 Pro es el último modelo de Apple que ofrece una experiencia de usuario incomparable. Con una pantalla Super Retina XDR de 6,1 pulgadas, el dispositivo ofrece imágenes de alta definición y colores vibrantes, lo que lo hace perfecto para ver fotos, videos y juegos. Además, el iPhone 12 Pro cuenta con un sistema de cámara triple de 12 megapíxeles que permite tomar fotos impresionantes incluso en condiciones de poca luz. Con una batería duradera y la capacidad de carga rápida inalámbrica, nunca tendrás que preocuparte por quedarte sin batería cuando más la necesites.

El iPhone 12 Pro también cuenta con 5G, lo que te permite navegar por la web, descargar aplicaciones y transmitir videos a velocidades increíblemente rápidas. Con una capacidad de almacenamiento de hasta 512 GB, tendrás suficiente espacio para almacenar todas tus aplicaciones, fotos y videos favoritos. Además, el dispositivo es resistente al agua y al polvo, lo que lo hace perfecto para aquellos que llevan un estilo de vida activo. 

En general, el iPhone 12 Pro es una opción impresionante para cualquier persona que busque un dispositivo móvil de alta calidad con características avanzadas y una experiencia de usuario sin igual.', 'Pantalla: Super Retina XDR de 6.1 pulgadas, con resolución de 2532 x 1170 píxeles (460 ppi), tecnología OLED, HDR10, Dolby Vision, True Tone y amplia gama de colores (P3).
Procesador: Apple A14 Bionic (seis núcleos, 64 bits) con motor neuronal de 16 núcleos.
Memoria RAM 6 GB.
Almacenamiento interno: 128 GB, 256 GB o 512 GB (no expandible).
Cámara trasera: Sistema de triple cámara de 12 MP:Lente gran angular: Apertura f/1.6, estabilización óptica de imagen (OIS).
Lente ultra gran angular: Apertura f/2.4, campo de visión de 120°.
Lente teleobjetivo: Apertura f/2.2, estabilización óptica de imagen (OIS), zoom óptico 2x.
Sensor LiDAR: Mejora el enfoque automático en condiciones de poca luz y permite capacidades de realidad aumentada (AR).
Grabación de video 4K a 24, 30 o 60 fps, Dolby Vision HDR en grabación, modo nocturno, Deep Fusion, Smart HDR 3, modo Retrato con control de profundidad, iluminación de retrato.
Cámara frontal: 12 MP, apertura f/2.2, grabación de video 4K a 24, 30 o 60 fps, modo nocturno, Deep Fusion, Smart HDR 3, slo-mo (Slofies).
Face ID: Reconocimiento facial mediante la cámara TrueDepth para desbloquear el dispositivo, autenticación y pagos.
Batería: 2,815 mAh (no removible), con autonomía de hasta 17 horas en reproducción de video y hasta 65 horas en reproducción de audio.
Conectividad: 5G, 4G LTE Advanced, Wi-Fi 6 (802.11ax) con MIMO, Bluetooth 5.0, NFC (solo para Apple Pay).
Sistema operativo: Originalmente con iOS 14, actualizable a versiones posteriores.
Carga inalámbrica : Compatible con cargadores Qi y MagSafe.
Carga rápida: Capaz de cargar hasta un 50% en 30 minutos con un cargador de 20 W o superior (no incluido en la caja).
Dimensiones: 146.7 x 71.5 x 7.4 mm.
Peso: 189 gramos.
Materiales: Cristal Ceramics Shield en la parte delantera, cristal texturizado en la parte trasera, con bordes de acero inoxidable.
Colores disponibles: Gris pacífico, plata, oro y azul pacífico.
Otros: Altavoces estéreo con soporte para Dolby Atmos, eliminación del conector de auriculares de 3.5 mm, soporte para Dual SIM (Nano SIM y eSIM).
Condición: Semi Nuevo.', '{"Estado": "Seminuevo", "_history": [{"at": 1776370877891, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 340000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376898788, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 340000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780085949392, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 370000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 128, "price": 370000, "stock": 1, "oldPrice": 780000}, {"gb": 256, "price": 380000, "stock": 0, "oldPrice": null}, {"gb": 512, "price": 430000, "stock": 0, "oldPrice": null}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "Azul", "Blanco", "Gris Espacial", "Titanio Del Desierto"]}'::jsonb, '[]'::jsonb, '[{"hex": "#4f6d8a", "name": "Azul"}, {"hex": "#f1f1f1", "name": "Blanco"}, {"hex": "#4a4a4a", "name": "Gris Espacial"}, {"hex": "#c4a57a", "name": "Titanio Del Desierto"}]'::jsonb, '["128 GB", "256 GB", "512 GB"]'::jsonb, NULL, true, '2026-04-16 20:21:18.524139+00', '2026-05-29 20:19:09.818236+00'),
('7dc2cbcb-318e-4566-becd-42ce35c9ae3e', 'custom-1776372799469', NULL, 'iPhone 16 Plus', 'iphone', 'iPhone', 'seminuevo', 795000, 970000, 2, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372784139-1776372784139-132.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372784139-1776372784139-132.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372784139-1776372785987-133.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372784139-1776372786888-134.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372784139-1776372787590-135.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372784139-1776372788282-136.png"]'::jsonb, 'El iPhone 16 Plus ofrece una experiencia completa con un diseño elegante, gran pantalla y rendimiento sobresaliente. Fabricado en aluminio y vidrio con frente de Ceramic Shield, mantiene la estética premium de Apple con una estructura duradera y ligera. Integra el nuevo chip A18, que proporciona un rendimiento más fluido, eficiencia energética mejorada y potencia suficiente para multitareas, juegos y uso intensivo sin esfuerzo.

Su amplia pantalla Super Retina XDR OLED de 6,7 pulgadas brinda imágenes brillantes y detalladas, con soporte HDR, brillo máximo de hasta 1000 nits y la práctica Dynamic Island, que permite gestionar notificaciones, música y llamadas de forma intuitiva. Ideal para ver contenido, trabajar o disfrutar de redes sociales con total comodidad.

El sistema de cámaras incluye un sensor principal de 48 MP con estabilización óptica y un ultra gran angular de 12 MP, ofreciendo fotografías nítidas, colores naturales y excelente desempeño en distintas condiciones de luz. La cámara frontal de 12 MP garantiza selfies de calidad y videollamadas claras.

La batería se destaca por su gran autonomía, alcanzando hasta 26 horas de reproducción de video, con carga rápida, compatibilidad con MagSafe y puerto USB-C, asegurando versatilidad y comodidad diaria.

Resistente al agua y al polvo con certificación IP68, disponible en colores vibrantes como azul, rosa, verde, blanco y negro, el iPhone 16 Plus es la opción ideal si prefieres una pantalla grande, excelente cámara y rendimiento de última generación en un diseño moderno y equilibrado.', '• Pantalla: Super Retina XDR de 6.7 pulgadas, resolución 2796 × 1290 píxeles (460 ppi), tecnología OLED, HDR, True Tone, amplia gama de colores (P3), Dynamic Island.

• Procesador: Apple A18, CPU de 6 núcleos, arquitectura de 64 bits, Neural Engine de 16 núcleos.

• Memoria RAM: 8 RAM.

• Almacenamiento interno: 128 GB, 256 GB, 512 GB, no expandible.

• Cámara trasera: Sistema de doble cámara, cámara principal de 48 MP con apertura f/1.6 y estabilización óptica por desplazamiento del sensor, cámara ultra gran angular de 12 MP con apertura f/2.2 y campo de visión de 120°, fotografía macro, fotos espaciales, video espacial, grabación de video 4K a 24, 30 o 60 fps, HDR con Dolby Vision hasta 60 fps, modo Cinemático, modo Acción, modo Noche, Deep Fusion, Smart HDR.

• Cámara frontal: Cámara TrueDepth de 12 MP con apertura f/1.9, grabación de video 4K a 24, 30 o 60 fps, HDR con Dolby Vision, modo Cinemático, modo Noche, Deep Fusion, Smart HDR, Slofies.

• Face ID: Reconocimiento facial mediante el sistema TrueDepth para desbloqueo del dispositivo, autenticación y pagos.

• Batería: Hasta 27 horas de reproducción de video, hasta 100 horas de reproducción de audio.

• Conectividad: 5G, Wi-Fi 7 (802.11be), Bluetooth 5.3, NFC para Apple Pay.

• Sistema operativo: iOS 18 de fábrica, actualizable a versiones posteriores.

• Resistencia al agua y polvo: Certificación IP68, resistente al agua hasta 6 metros durante un máximo de 30 minutos.

• Carga inalámbrica: Compatible con MagSafe y cargadores Qi.

• Carga rápida: Hasta un 50% de carga en aproximadamente 30 minutos con un adaptador de 20 W o superior, cargador no incluido.

• Puerto: USB-C para carga y transferencia de datos.

• Dimensiones: 160.9 × 77.8 × 7.8 mm.

• Peso: 199 gramos.

• Materiales: Parte frontal con Ceramic Shield, parte trasera de vidrio con infusión de color, marco de aluminio.

• Colores disponibles: Negro, blanco, rosa, verde azulado, ultramar.

• Otros: Botón de Acción personalizable, botón Camera Control dedicado para fotografía y video, altavoces estéreo con soporte para Dolby Atmos, Dual SIM (Nano-SIM y eSIM, según región), sin conector de auriculares de 3.5 mm.

Condición: Semi Nuevo', '{"Estado": "Seminuevo", "_history": [{"at": 1776372799468, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 750000}, {"at": 1776373176700, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 750000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376746874, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 750000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780084850285, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 750000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780084888781, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 795000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 128, "price": 795000, "stock": 1, "oldPrice": 970000}, {"gb": 256, "price": 847000, "stock": 1, "oldPrice": null}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "Gris Espacial", "Blanco", "Titanio Del Desierto", "Titanio Natural"]}'::jsonb, '[]'::jsonb, '[{"hex": "#4a4a4a", "name": "Gris Espacial"}, {"hex": "#f1f1f1", "name": "Blanco"}, {"hex": "#b9b3a9", "name": "Titanio Natural"}, {"hex": "#c4a57a", "name": "Titanio Del Desierto"}]'::jsonb, '["128 GB", "256 GB"]'::jsonb, NULL, true, '2026-04-16 20:53:20.030565+00', '2026-05-29 20:01:29.370473+00'),
('be1a5ee7-12b1-4f8b-8144-94f853c861c7', 'custom-1776372704244', NULL, 'iPhone 16', 'iphone', 'iPhone', 'seminuevo', 700000, NULL, 10, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372694785-1776372694785-117.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372694785-1776372694785-117.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372694785-1776372696202-118.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372694785-1776372697501-119.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372694785-1776372698417-120.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372694785-1776372699067-121.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372694785-1776372699740-122.png"]'::jsonb, 'iPhone 16. Diseñado para Apple Intelligence. Con Control de la Cámara. Cámara Fusion de 48 MP. Cinco colores espectaculares. Y el chip A18.

DISEÑADO PARA APPLE INTELLIGENCE  Apple Intelligence es un sistema de inteligencia personal integrado en tu iPhone que te ayuda a escribir, expresarte y hacer de todo con mucha facilidad. Y las avanzadas protecciones de privacidad te dan la tranquilidad de saber que nadie más podrá acceder a tus datos. Ni siquiera Apple. [Apple Intelligence estará disponible en inglés de Estados Unidos a finales de 2024].
CONTROL DE LA CÁMARA  Con esta nueva funcionalidad podrás acceder fácilmente a las herramientas de la cámara, como el zoom o la profundidad de campo, para que no se te escape ni un momento.
CAPTURAS MÁS AMPLIAS Y DETALLADAS  La mejorada cámara ultra gran angular con autoenfoque te permite capturar videos y fotos macro con un asombroso nivel de detalle y nitidez. Usa la cámara Fusion de 48 MP para tomar fotos increíbles de alta resolución y haz zoom con la cámara teleobjetivo de calidad óptica de 2×.
ESTILOS FOTOGRÁFICOS  La nueva generación de Estilos Fotográficos te da más libertad creativa para que cada foto tenga tu sello personal. Y ahora puedes revertir cualquier estilo que hayas elegido, en cualquier momento. ¿Cambiaste de idea? No pasa nada.
CHIP A18 SÚPER BRILLANTE  El chip A18 es dos generaciones más avanzado que el chip A16 Bionic del iPhone 15. Es el motor detrás de Apple Intelligence y te permite disfrutar funcionalidades de foto y video avanzadas y juegos del más alto nivel con gran eficiencia.
MAYOR DURACIÓN DE LA BATERÍA  El iPhone 16 se complementa a la perfección con el chip A18, y juntos logran un gran salto en la duración de la batería: hasta 22 horas de reproducción de video.2Acopla un cargador MagSafe para obtener una carga inalámbrica más rápida o carga a través de la entrada USB-C.
DISEÑADO PARA DURAR  El iPhone 16 tiene un resistente diseño de aluminio de grado aeroespacial con una pantalla Super Retina XDR de 6,1 pulgadas. Es increíblemente duradero gracias al Ceramic Shield de última generación, que es dos veces más resistente que cualquier vidrio de smartphone.
PERSONALIZA TU IPHONE  Con iOS 18 puedes cambiar el color de los íconos de la pantalla de inicio a tu gusto. Encuentra tus tomas favoritas en un flash en la rediseñada app Fotos. Y agrega divertidos efectos animados a cualquier palabra, frase o emoji en iMessage.
FUNCIONALIDADES ESENCIALES DE SEGURIDAD  Con Detección de Choques, el iPhone puede detectar si sufres un accidente automovilístico grave y pedir ayuda cuando tú no puedes.', 'Pantalla: Super Retina XDR de 6.1 pulgadas, resolución 2556 × 1179 píxeles (460 ppi), tecnología OLED, HDR, True Tone, amplia gama de colores (P3), Dynamic Island.
Procesador: Apple A18, CPU de 6 núcleos, arquitectura de 64 bits, Neural Engine de 16 núcleos.
Memoria RAM: 8 GB.
Almacenamiento interno: 128 GB, 256 GB, 512 GB, no expandible.
Cámara trasera: Sistema de doble cámara, lente principal 48 MP f/1.6 con estabilización óptica por desplazamiento del sensor, lente ultra gran angular 12 MP f/2.2 con campo de visión de 120° y macro, fotos espaciales, video espacial, grabación 4K a 24/30/60 fps, HDR con Dolby Vision hasta 60 fps, modo Cinemático, modo Acción, modo Noche, Deep Fusion, Smart HDR.
Cámara frontal: Cámara TrueDepth 12 MP f/1.9, grabación de video 4K a 24/30/60 fps, HDR con Dolby Vision, modo Cinemático, modo Noche, Deep Fusion, Smart HDR, Slofies.
Face ID: Reconocimiento facial mediante sistema TrueDepth para desbloqueo, autenticación y pagos.
Batería: Hasta 22 horas de reproducción de video, hasta 80 horas de reproducción de audio.
Conectividad: 5G, Wi-Fi 7 (802.11be), Bluetooth 5.3, NFC para Apple Pay.
Sistema operativo: iOS 18 de fábrica, actualizable a versiones posteriores.
Resistencia al agua y polvo: Certificación IP68, resistente hasta 6 metros durante 30 minutos.
Carga inalámbrica: Compatible con MagSafe y Qi.
Carga rápida: Hasta 50% de carga en aproximadamente 30 minutos con adaptador de 20 W o superior, cargador no incluido.
Puerto: USB-C para carga y datos.
Dimensiones: 147.6 × 71.6 × 7.8 mm.
Peso: 170 gramos.
Materiales: Parte frontal con Ceramic Shield, parte trasera de vidrio con infusión de color, marco de aluminio.
Colores disponibles: Negro, blanco, rosa, verde azulado, ultramar.
Otros: Botón de Acción personalizable, botón Camera Control dedicado para foto y video, altavoces estéreo con Dolby Atmos, Dual SIM (Nano-SIM y eSIM, según región), sin conector de auriculares de 3.5 mm.
Condición: Semi-Nuevo', '{"Estado": "Seminuevo", "_history": [{"at": 1776372704243, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 660000}, {"at": 1776373177323, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 660000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376715740, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 660000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780084928807, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 700000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 128, "price": 710000, "stock": 10, "oldPrice": 970000}, {"gb": 256, "price": 700000, "stock": 0, "oldPrice": null}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "Púrpura", "Celeste", "Rosa", "Titanio Blanco", "Medianoche"]}'::jsonb, '[]'::jsonb, '[{"hex": "#8b6bbd", "name": "Púrpura"}, {"hex": "#9ecae1", "name": "Celeste"}, {"hex": "#f4b6c2", "name": "Rosa"}, {"hex": "#e8e8e6", "name": "Titanio Blanco"}, {"hex": "#191921", "name": "Medianoche"}]'::jsonb, '["128 GB", "256 GB"]'::jsonb, NULL, true, '2026-04-16 20:51:44.759231+00', '2026-05-29 20:02:09.230316+00'),
('1cb43fdd-ddc5-4814-adfd-1a62c584827e', 'custom-1776372567806', NULL, 'iPhone 16e', 'iphone', 'iPhone', 'seminuevo', 498000, 969000, 1, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372560663-1776372560663-123.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372560663-1776372560663-123.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372560663-1776372562306-125.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/custom-1776372567806-1776372584889-124.png"]'::jsonb, 'El iPhone 16e está diseñado para Apple Intelligence y tiene toda la potencia del chip A18. Te permite sacar fotos en súper alta resolución con la cámara Fusion de 48 MP. Y como trae una superbatería, tienes más tiempo para mandar mensajes, navegar y mucho más.

DISEÑADO PARA APPLE INTELLIGENCE — Personal, privado y poderoso. Escribe, exprésate y haz de todo con mucha facilidad.
CHIP A18. A LA VELOCIDAD DEL FUTURO — El chip A18 te permite disfrutar Apple Intelligence, los juegos y las actualizaciones periódicas de iOS para que tu iPhone funcione como el primer día.
SUPERBATERÍA — Manda mensajes, navega y disfruta hasta 26 horas de reproducción de video: la mayor duración de batería en un iPhone de 6,1 pulgadas.3
CÁMARAS — El sistema de cámara dos en uno cuenta con una cámara Fusion de 48 MP para fotos en súper alta resolución y una cámara teleobjetivo de calidad óptica de 2x. Y saca maravillosas selfies con la cámara frontal de 12 MP.
DISEÑO RESISTENTE. PANTALLA IMPRESIONANTE — Una increíble pantalla de 6,1 pulgadas con tecnología OLED y frente de Ceramic Shield, más resistente que cualquier vidrio de smartphone.
BOTÓN DE ACCIÓN — Personalízalo para acceder directamente a tus apps o funcionalidades favoritas, o para que Inteligencia Visual te ayude a descubrir un mundo de información sobre lo que te rodea.
PONLE TU SELLO — iOS 18 te permite personalizar la pantalla de inicio y la pantalla bloqueada, enviar mensajes con efectos de texto, mandar Tapbacks con cualquier emoji y mucho más.
PRIVACIDAD — Usa Face ID para desbloquear tu teléfono de forma segura e iniciar sesión.', 'Equipo cargado desde panel administrativo Blackpink Store.', '{"Estado": "Seminuevo", "_history": [{"at": 1776372588493, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 470000}, {"at": 1776372567805, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 470000}, {"at": 1776373179905, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 470000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376651562, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 470000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780084678643, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 498000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 128, "price": 498000, "stock": 1, "oldPrice": 969000}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "Medianoche", "Blanco"]}'::jsonb, '[]'::jsonb, '[{"hex": "#191921", "name": "Medianoche"}, {"hex": "#f1f1f1", "name": "Blanco"}]'::jsonb, '["128 GB"]'::jsonb, NULL, true, '2026-04-16 20:49:28.363588+00', '2026-05-29 19:57:59.434188+00'),
('86e3c739-6c67-43c0-b094-058649b232f7', 'custom-1776371380098', NULL, 'iPhone 13', 'iphone', 'iPhone', 'seminuevo', 483000, NULL, 2, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371363947-1776371363947-42.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371363947-1776371363947-42.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371363947-1776371365129-43.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371363947-1776371365760-44.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371363947-1776371366448-45.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371363947-1776371367082-46.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371363947-1776371367613-47.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371363947-1776371368383-48.png"]'::jsonb, 'El iPhone 13 es el último modelo de Apple en la línea de dispositivos móviles. Con una pantalla Super Retina XDR de 6.1 pulgadas, el dispositivo ofrece una experiencia de visualización envolvente con colores vibrantes y detalles impresionantes. Además, cuenta con un sistema de cámara dual de 12 megapíxeles con tecnología de estabilización óptica de imagen, que te permite tomar fotos y videos con calidad profesional incluso en condiciones de poca luz. La cámara también tiene la capacidad de grabar videos en calidad 4K a 60 cuadros por segundo, lo que hace que las grabaciones sean aún más impresionantes.

El iPhone 13 también cuenta con el chip A15 Bionic, que es el chip más rápido en un smartphone hasta el momento. Este chip permite un rendimiento increíblemente rápido y eficiente, lo que significa que podrás realizar tareas exigentes, como jugar juegos y editar videos, sin problemas. Con la conectividad 5G, podrás navegar por la web, descargar aplicaciones y transmitir videos a velocidades increíblemente rápidas. Además, el dispositivo cuenta con una batería duradera y la capacidad de carga rápida inalámbrica, lo que significa que podrás disfrutar del dispositivo durante todo el día sin preocuparte por quedarte sin energía. 

En general, el iPhone 13 es una excelente opción para aquellos que buscan un dispositivo móvil de alta calidad con características avanzadas y una experiencia de usuario inigualable.', 'Pantalla: Super Retina XDR de 6.1 pulgadas, con resolución de 2532 x 1170 píxeles (460 ppi), tecnología OLED, HDR10, Dolby Vision, True Tone y amplia gama de colores (P3).
Procesador: Apple A15 Bionic (seis núcleos, 64 bits) con motor neuronal de 16 núcleos.
Memoria RAM: 4 GB.
Almacenamiento interno: 128 GB, 256 GB o 512 GB (no expandible).
Cámara trasera: Doble cámara de 12 MP:Lente gran angular: Apertura f/1.6, estabilización óptica de imagen (OIS).
Lente ultra gran angular Apertura f/2.4, campo de visión de 120°.
Grabación de video 4K a 24, 30 o 60 fps, modo Cinemático para video, modo nocturno, Deep Fusion, Smart HDR 4, modo Retrato con control de profundidad.
Cámara frontal: 12 MP, apertura f/2.2, grabación de video 4K a 24, 30 o 60 fps, modo Cinemático para video, modo nocturno, Deep Fusion, Smart HDR 4, slo-mo (Slofies).
Face ID: Reconocimiento facial mediante la cámara TrueDepth para desbloquear el dispositivo, autenticación y pagos.
Batería: 3,240 mAh (no removible), con autonomía de hasta 19 horas en reproducción de video y hasta 75 horas en reproducción de audio.
Conectividad: 5G, 4G LTE Advanced, Wi-Fi 6 (802.11ax) con MIMO, Bluetooth 5.0, NFC (solo para Apple Pay).
Sistema operativo: Originalmente con iOS 15, actualizable a versiones posteriores.
Carga inalámbrica: Compatible con cargadores Qi y MagSafe.
Carga rápida: Capaz de cargar hasta un 50% en 30 minutos con un cargador de 20 W o superior (no incluido en la caja).
Dimensiones: 146.7 x 71.5 x 7.65 mm.
Peso: 174 gramos.
Materiales: Cristal tanto en la parte delantera como trasera (Ceramic Shield), con bordes de aluminio.
Colores disponibles: Rojo (Product RED), medianoche, starlight, azul y rosa.
Otros: Altavoces estéreo, soporte para Dolby Atmos, eliminación del conector de auriculares de 3.5 mm, soporte para Dual SIM (Nano SIM y eSIM).
Condición: Semi Nuevo.', '{"Estado": "Seminuevo", "_history": [{"at": 1776371380097, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 380000}, {"at": 1776373196037, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 380000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376214189, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 380000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780085701683, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 483000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 128, "price": 483000, "stock": 1, "oldPrice": null}, {"gb": 256, "price": 498000, "stock": 1, "oldPrice": null}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "Negro", "Verde Alpino", "Rojo", "Blanco", "Azul", "Rosa"]}'::jsonb, '[]'::jsonb, '[{"hex": "#1f1f1f", "name": "Negro"}, {"hex": "#4a5d4a", "name": "Verde Alpino"}, {"hex": "#c0392b", "name": "Rojo"}, {"hex": "#f1f1f1", "name": "Blanco"}, {"hex": "#4f6d8a", "name": "Azul"}, {"hex": "#f4b6c2", "name": "Rosa"}]'::jsonb, '["128 GB", "256 GB"]'::jsonb, NULL, true, '2026-04-16 20:29:40.805926+00', '2026-05-29 20:15:02.358588+00'),
('034a2edf-3386-4e8b-8b3e-92cc1ea6257f', 'custom-1776370734118', NULL, 'iPhone 11 Pro Max', 'iphone', 'iPhone', 'seminuevo', 265000, 700000, 0, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370724841-1776370724841-12.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370724841-1776370724841-12.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370724841-1776370727069-13.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370724841-1776370727864-14.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370724841-1776370728494-15.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776370724841-1776370729201-16.png"]'::jsonb, 'El iPhone 11 Pro Max es uno de los teléfonos inteligentes más avanzados de Apple. Este dispositivo cuenta con una pantalla OLED Super Retina XDR de 6,5 pulgadas, con una resolución de 2688 x 1242 píxeles y una densidad de píxeles de 458 ppp, lo que ofrece una calidad de imagen impresionante con colores vibrantes y negros profundos. Además, su diseño de vidrio en la parte frontal y trasera, con un marco de acero inoxidable de alta calidad, le da un aspecto elegante y resistente.

El iPhone 11 Pro Max está equipado con el procesador A13 Bionic de seis núcleos de Apple, lo que garantiza un rendimiento rápido y fluido en todas las aplicaciones y juegos. Además, cuenta con una cámara trasera triple de 12 megapíxeles con un gran angular, un ultra gran angular y un teleobjetivo, lo que permite tomar fotos y videos impresionantes en cualquier situación. También tiene una cámara frontal TrueDepth de 12 megapíxeles con la función de Retina Flash para obtener selfies más naturales en condiciones de poca luz.

 En general, el iPhone 11 Pro Max es una excelente opción para aquellos usuarios que buscan un teléfono inteligente de gama alta con una pantalla OLED impresionante, un rendimiento excepcional y una cámara avanzada.', 'Pantalla: Super Retina XDR de 6.5 pulgadas, con resolución de 2688 x 1242 píxeles (458 ppi), tecnología OLED, HDR10, Dolby Vision, True Tone y amplia gama de colores (P3).
Procesador: Apple A13 Bionic (seis núcleos, 64 bits) con motor neuronal de tercera generación.
Memoria: RAM 4 GB.
Almacenamiento interno: 64 GB, 256 GB o 512 GB (no expandible).
Cámara trasera: Sistema de triple cámara de 12 MP:Lente gran angular: Apertura f/1.8, estabilización óptica de imagen (OIS).
Lente ultra gran angular: Apertura f/2.4, campo de visión de 120°.
Lente teleobjetivo: Apertura f/2.0, estabilización óptica de imagen (OIS), zoom óptico 2x.
Grabación de video 4K a 24, 30 o 60 fps, modo nocturno, Deep Fusion, Smart HDR, modo Retrato con control de profundidad, iluminación de retrato.
Cámara frontal: 12 MP, apertura f/2.2, grabación de video 4K a 24, 30 o 60 fps, modo Retrato, Smart HDR, slo-mo (Slofies).
Face ID: Reconocimiento facial mediante la cámara TrueDepth para desbloquear el dispositivo, autenticación y pagos.
Batería: 3,969 mAh (no removible), con autonomía de hasta 20 horas en reproducción de video y hasta 80 horas en reproducción de audio.
Conectividad: 4G LTE Advanced, Wi-Fi 6 (802.11ax) con MIMO, Bluetooth 5.0, NFC (solo para Apple Pay).
Sistema operativo: Originalmente con iOS 13, actualizable a versiones posteriores.
Carga inalámbrica : Compatible con cargadores Qi.
Carga rápida: Capaz de cargar hasta un 50% en 30 minutos con el cargador de 18 W incluido en la caja.
Dimensiones: 158 x 77.8 x 8.1 mm.
Peso: 226 gramos.
Materiales: Cristal mate texturizado en la parte trasera, con bordes de acero inoxidable
Colores disponibles: Oro, gris espacial, plata y verde noche.
Otros: Altavoces estéreo con soporte para Dolby Atmos, eliminación del conector de auriculares de 3.5 mm, soporte para Dual SIM (Nano SIM y eSIM).
Condición: Semi Nuevo.', '{"Estado": "Seminuevo", "_history": [{"at": 1776370734117, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 240000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376924735, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 240000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780085977041, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 265000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 64, "price": 265000, "stock": 0, "oldPrice": 700000}, {"gb": 256, "price": 280000, "stock": 0, "oldPrice": null}, {"gb": 515, "price": 330000, "stock": 0, "oldPrice": null}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "Blanco", "Grafito", "Oro", "Gris Espacial"]}'::jsonb, '[]'::jsonb, '[{"hex": "#f1f1f1", "name": "Blanco"}, {"hex": "#4a4a4a", "name": "Gris Espacial"}, {"hex": "#e6c992", "name": "Oro"}, {"hex": "#4a4a4a", "name": "Grafito"}]'::jsonb, '["64 GB", "256 GB", "515 GB"]'::jsonb, NULL, true, '2026-04-16 20:18:54.73516+00', '2026-05-29 20:19:37.703628+00'),
('ecacd44b-5133-4a03-88a0-747ac8dabfd7', 'custom-1776372485405', NULL, 'iPhone 15 Pro Max', 'iphone', 'iPhone', 'seminuevo', 798000, 1300000, 0, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372474467-1776372474467-113.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372474467-1776372474467-113.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372474467-1776372476266-114.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372474467-1776372477704-115.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372474467-1776372478424-116.png"]'::jsonb, 'iPhone 15 Pro Max. Forjado en titanio y equipado con el revolucionario chip A17 Pro, un Botón de Acción personalizable y el sistema de cámaras más potente en un iPhone.

FORJADO EN TITANIO El iPhone 15 Pro Max tiene un diseño resistente y liviano, con titanio de calidad aeroespacial y parte posterior de vidrio mate texturizado. Frente de Ceramic Shield, más duro que el vidrio más duro de cualquier smartphone. Y resistencia a las salpicaduras, al agua y al polvo.
PANTALLA AVANZADA  La pantalla Super Retina XDR de 6,7 pulgadas con ProMotion aumenta la frecuencia de actualización hasta 120 Hz cuando necesitas el máximo rendimiento gráfico. La Dynamic Island muestra alertas y Actividades en Vivo al instante. Y la pantalla siempre activa te permite tener información siempre a la vista sin mover un dedo.
REVOLUCIONARIO CHIP A17 PRO  Con la GPU de nivel pro, los juegos móviles son más inmersivos, con escenarios llenos de detalles y personajes más realistas. Y el chip A17 Pro es tan eficiente que la batería es capaz de seguirte el ritmo todo el día.
SISTEMA DE CÁMARAS PRO Multiplica tus opciones de encuadre con 7 lentes pro. Toma fotos en súper alta resolución con más colores y detalles que nunca con la cámara gran angular de 48 MP. Y haz primeros planos súper nítidos desde más lejos con la cámara teleobjetivo de 5× del iPhone 15 Pro Max.
BOTÓN DE ACCIÓN PERSONALIZABLE  El Botón de Acción te lleva volando a tu funcionalidad favorita, como el modo Silencio, Cámara, Nota de Voz o Atajos. Configúralo con la que quieras usar y mantenlo presionado para que haga su magia.
CONEXIONES MUY PRO  La nueva entrada USB-C te permite cargar tu Mac o iPad con el mismo cable que usas para cargar el iPhone 15 Pro Max. Con USB 3, las velocidades de transferencia pisan el acelerador a fondo. Y con la conexión WiFi 6E, podrás descargar archivos hasta el doble de rápido.
FUNCIONALIDADES ESENCIALES DE SEGURIDAD  Con Detección de Choques, el iPhone puede identificar si sufres un accidente automovilístico grave y pedir ayuda cuando tú no puedes.
INNOVACIONES QUE MARCAN LA DIFERENCIA El iPhone cuenta con tecnologías de privacidad que te ayudan a mantener el control de tus datos. Está fabricado con más materiales reciclados para reducir su impacto medioambiental. Y viene con funcionalidades integradas que lo hacen accesible para todo el mundo.', 'Pantalla: Super Retina XDR de 6.7 pulgadas, con resolución de 2796 x 1290 píxeles (460 ppi), tecnología OLED, HDR10, Dolby Vision, True Tone y amplia gama de colores (P3). Soporta Dynamic Island y una tasa de refresco adaptativa de hasta 120 Hz.
Procesador: Apple A17 Pro (seis núcleos, 64 bits) con motor neuronal de 16 núcleos y GPU de alto rendimiento.
Memoria RAM: 8 GB.
Almacenamiento interno: 256 GB, 512 GB o 1 TB (no expandible).
Cámara trasera: Sistema de triple cámara de 48 MP:Lente gran angular: 48 MP con apertura f/1.78, estabilización óptica de imagen (OIS).
Lente ultra gran angular: 12 MP con apertura f/2.2, campo de visión de 120°.
Lente teleobjetivo: 12 MP con apertura f/2.8, estabilización óptica de imagen (OIS), zoom óptico 5x.
Sensor LiDAR: Mejora el enfoque automático en condiciones de poca luz y permite capacidades avanzadas de realidad aumentada (AR).
Grabación de video 4K a 24, 30 o 60 fps, Dolby Vision HDR en grabación, modo Cinemático para video, ProRAW, ProRes video, modo nocturno, Deep Fusion, Smart HDR 4.
Cámara frontal: 12 MP, apertura f/1.9, grabación de video 4K a 24, 30 o 60 fps, modo Cinemático para video, modo nocturno, Deep Fusion, Smart HDR 4, slo-mo (Slofies).
Face ID: Reconocimiento facial mediante la cámara TrueDepth para desbloquear el dispositivo, autenticación y pagos.
Batería: Hasta 29 horas de reproducción de video y hasta 95 horas de reproducción de audio.
Conectividad: 5G, Wi-Fi 6E (802.11ax) con MIMO, Bluetooth 5.3, NFC (solo para Apple Pay), USB-C con soporte para Thunderbolt 4.
Sistema operativo: Originalmente con iOS 17, actualizable a versiones posteriores.
Resistencia al agua y polvo: Certificación IP68 (resistente al agua hasta 6 metros durante 30 minutos).
Carga inalámbrica: Compatible con cargadores MagSafe y Qi.
Carga rápida: Capaz de cargar hasta un 50% en 30 minutos con un cargador de 20 W o superior (no incluido en la caja).
Dimensiones: 159.9 x 76.7 x 8.3 mm.
Peso: 221 gramos.
Materiales: Titanio en el marco, cristal Ceramic Shield en la parte delantera, cristal texturizado en la parte trasera.
Colores disponibles: Titanio, gris oscuro, plata y azul.
Otros: Altavoces estéreo con soporte para Dolby Atmos, eliminación del conector de auriculares de 3.5 mm, soporte para Dual SIM (Nano SIM y eSIM).
Condición: Semi Nuevo.', '{"Estado": "Seminuevo", "_history": [{"at": 1776372485404, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 800000}, {"at": 1776373180518, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 800000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376631489, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 800000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780084987903, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 798000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 128, "price": 798000, "stock": 0, "oldPrice": 1300000}, {"gb": 512, "price": 850000, "stock": 0, "oldPrice": 1200000}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "Blanco", "Sierra Azul", "Titanio Natural"]}'::jsonb, '[]'::jsonb, '[{"hex": "#f1f1f1", "name": "Blanco"}, {"hex": "#9eb5cb", "name": "Sierra Azul"}, {"hex": "#b9b3a9", "name": "Titanio Natural"}]'::jsonb, '["128 GB", "512 GB"]'::jsonb, NULL, true, '2026-04-16 20:48:05.903244+00', '2026-05-29 20:03:08.808076+00'),
('4d299715-fde0-4de0-8eb7-4961e4a92a67', 'custom-1776372127392', NULL, 'iPhone 14 Pro Max', 'iphone', 'iPhone', 'seminuevo', 700000, 1350000, 1, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372119441-1776372119441-87.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372119441-1776372119441-87.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372119441-1776372120730-88.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372119441-1776372121545-89.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372119441-1776372122254-90.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372119441-1776372123056-91.png"]'::jsonb, 'El iPhone 14 Pro Max es la máxima expresión de la innovación y el rendimiento en la línea de teléfonos inteligentes de Apple. Su diseño refinado y sofisticado, con un cuerpo de acero inoxidable resistente y elegante, lo convierte en un dispositivo premium. La pantalla Super Retina XDR OLED de gran tamaño ofrece una calidad visual excepcional, con colores vivos, contrastes intensos y una reproducción de contenido increíblemente nítida. Además, la tecnología ProMotion con una alta frecuencia de actualización proporciona una experiencia de desplazamiento y navegación ultra suave.

En términos de rendimiento, el iPhone 14 Pro Max está equipado con el potente chip A16 Bionic de Apple, que garantiza un rendimiento superior y una eficiencia energética notable. Ya sea para ejecutar aplicaciones exigentes, jugar a juegos intensos o realizar tareas de edición multimedia, este dispositivo no tiene rival. Además, su sistema de triple cámara trasera, compuesto por un sensor principal de alta resolución, un ultra gran angular y un teleobjetivo, permite capturar imágenes impresionantes con gran detalle y versatilidad. También cuenta con funciones de grabación de video profesional, como la capacidad de grabar en Dolby Vision y una amplia gama de herramientas de edición. En definitiva, el iPhone 14 Pro Max ofrece una experiencia incomparable en términos de diseño, rendimiento y capacidades fotográficas, consolidándose como un referente en la industria de los teléfonos inteligentes.', 'Pantalla: Super Retina XDR de 6.7 pulgadas, con resolución de 2796 x 1290 píxeles (460 ppi), tecnología OLED, HDR10, Dolby Vision, True Tone y amplia gama de colores (P3). Soporta ProMotion con una tasa de refresco adaptativa de hasta 120 Hz.
Procesador: Apple A16 Bionic (seis núcleos, 64 bits) con motor neuronal de 16 núcleos.
Memoria RAM: 6 GB.
Almacenamiento interno: 128 GB, 256 GB, 512 GB o 1 TB (no expandible).
Cámara trasera: Sistema de triple cámara de 48 MP:Lente gran angular: 48 MP con apertura f/1.78, estabilización óptica de imagen (OIS).
Lente ultra gran angular: 12 MP con apertura f/2.2, campo de visión de 120°.
Lente teleobjetivo: 12 MP con apertura f/2.8, estabilización óptica de imagen (OIS), zoom óptico 3x.
Sensor LiDAR: Mejora el enfoque automático en condiciones de poca luz y permite capacidades avanzadas de realidad aumentada (AR).
Grabación de video 4K a 24, 30 o 60 fps, Dolby Vision HDR en grabación, modo Cinemático para video, modo nocturno, Deep Fusion, Smart HDR 4, modo Retrato con control de profundidad.
Cámara frontal: 12 MP, apertura f/1.9, grabación de video 4K a 24, 30 o 60 fps, modo Cinemático para video, modo nocturno, Deep Fusion, Smart HDR 4, slo-mo (Slofies).
Face ID: Reconocimiento facial mediante la cámara TrueDepth para desbloquear el dispositivo, autenticación y pagos.
Batería: Hasta 29 horas de reproducción de video y hasta 95 horas de reproducción de audio.
Conectividad: 5G, 4G LTE Advanced, Wi-Fi 6 (802.11ax) con MIMO, Bluetooth 5.3, NFC (solo para Apple Pay).
Sistema operativo: Originalmente con iOS 16, actualizable a versiones posteriores.
Resistencia al agua y polvo: Certificación IP68 (resistente al agua hasta 6 metros durante 30 minutos).
Carga inalámbrica: Compatible con cargadores Qi y MagSafe.
Carga rápida: Capaz de cargar hasta un 50% en 30 minutos con un cargador de 20 W o superior (no incluido en la caja).
Dimensiones: 160.7 x 77.6 x 7.85 mm.
Peso: 240 gramos.
Materiales: Cristal Ceramic Shield en la parte delantera, cristal texturizado en la parte trasera, con bordes de acero inoxidable.
Colores disponibles: Gris espacial, plata, dorado y morado.
Otros: Altavoces estéreo con soporte para Dolby Atmos, eliminación del conector de auriculares de 3.5 mm, soporte para Dual SIM (Nano SIM y eSIM).
Condición: Semi Nuevo.', '{"Estado": "Seminuevo", "_history": [{"at": 1776372127391, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 660000}, {"at": 1776373191258, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 660000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376493597, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 660000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780085176403, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 700000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 128, "price": 700000, "stock": 0, "oldPrice": 1350000}, {"gb": 256, "price": 774000, "stock": 1, "oldPrice": 1350000}, {"gb": 512, "price": 770000, "stock": 0, "oldPrice": null}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "Blanco", "Oro", "Púrpura", "Negro"]}'::jsonb, '[]'::jsonb, '[{"hex": "#f1f1f1", "name": "Blanco"}, {"hex": "#e6c992", "name": "Oro"}, {"hex": "#8b6bbd", "name": "Púrpura"}, {"hex": "#1f1f1f", "name": "Negro"}]'::jsonb, '["128 GB", "256 GB", "512 GB"]'::jsonb, NULL, true, '2026-04-16 20:42:08.144654+00', '2026-05-29 20:06:17.872154+00'),
('9465d964-0dde-4c47-ad9f-99107f2f0b61', 'custom-1777066806674', NULL, 'Cargador Carga Rapida Lighting OEM', 'otros', 'Otros', 'seminuevo', 15000, NULL, 1, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1777066805650-1777066805650-Captura_de_pantalla_2026-04-24_172804.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1777066805650-1777066805650-Captura_de_pantalla_2026-04-24_172804.png"]'::jsonb, 'Producto ingresado desde panel administrativo.', 'Equipo cargado desde panel administrativo Blackpink Store.', '{"Estado": "Seminuevo", "_history": [{"at": 1777066806674, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 15000}, {"at": 1777066810634, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 15000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 128, "price": 15000, "stock": 1, "oldPrice": null}], "Categoría": "Otros", "_colorImages": {}, "_imageColors": [""]}'::jsonb, '[]'::jsonb, '[]'::jsonb, '["128 GB"]'::jsonb, NULL, true, '2026-04-24 21:40:05.244038+00', '2026-04-24 21:40:09.188205+00'),
('69eb1eb0-89a4-407f-a339-71925ea73a85', 'custom-1776372276896', NULL, 'iPhone 15 Plus', 'iphone', 'iPhone', 'seminuevo', 690000, 1300000, 2, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372261673-1776372261673-100.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372261673-1776372261673-100.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372261673-1776372262716-101.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372261673-1776372263360-102.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372261673-1776372264016-103.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372261673-1776372264648-104.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/custom-1776372276896-1776372305110-105.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/custom-1776372276896-1776372306226-106.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/custom-1776372276896-1776372306926-107.png"]'::jsonb, 'El iPhone 15 Plus combina estilo y potencia en un formato más grande, con su elegante cuerpo de aluminio y vidrio con frente de Ceramic Shield. Incorpora el chip A16 Bionic y 6 GB de RAM, ofreciendo un rendimiento fluido y eficiente para quienes buscan una experiencia premium sin llegar al modelo Pro Max.

Su amplia pantalla Super Retina XDR OLED de 6,7 pulgadas entrega imágenes nítidas, colores vibrantes y brillo típico de hasta 1000 nits con soporte HDR. Además, integra la Dynamic Island, que sustituye al notch tradicional y mejora la interacción con notificaciones, música y llamadas, perfecta para ver contenido, redes sociales o trabajar cómodamente.

El sistema de cámara doble mantiene un sensor principal de 48 MP con estabilización óptica, acompañado de un ultra gran angular de 12 MP, logrando fotos detalladas y videos estables en cualquier condición. La cámara frontal de 12 MP permite retratos y videollamadas con gran claridad.

La batería destaca por su mayor autonomía, alcanzando hasta 26 horas de reproducción de video, con carga rápida y compatibilidad con MagSafe y USB-C, asegurando un día completo de uso intensivo.

Resistente al agua y al polvo con certificación IP68, y disponible en azul, rosa, amarillo, verde y negro, el iPhone 15 Plus es ideal si prefieres una pantalla grande, excelente cámara y potencia duradera en un diseño moderno y equilibrado.', 'Pantalla: Super Retina XDR de 6.7 pulgadas, con resolución de 2556 x 1179 píxeles (460 ppi), tecnología OLED, HDR10, Dolby Vision, True Tone y amplia gama de colores (P3). Soporta Dynamic Island, que reemplaza el notch con una interfaz interactiva.
Procesador: Apple A16 Bionic (seis núcleos, 64 bits) con motor neuronal de 16 núcleos.
Memoria RAM: 6 GB.
Almacenamiento interno: 128 GB, 256 GB, 512 GB, 1T (no expandible).
Cámara trasera: Sistema de doble cámara de 48 MP:Lente gran angular: 48 MP con apertura f/1.6, estabilización óptica de imagen (OIS).
Lente ultra gran angular: 12 MP con apertura f/2.4, campo de visión de 120°.
Grabación de video 4K a 24, 30 o 60 fps, Dolby Vision HDR en grabación, modo Cinemático para video, modo nocturno, Deep Fusion, Smart HDR 4.
Cámara frontal: 12 MP, apertura f/1.9, grabación de video 4K a 24, 30 o 60 fps, modo Cinemático para video, modo nocturno, Deep Fusion, Smart HDR 4, slo-mo (Slofies).
Face ID: Reconocimiento facial mediante la cámara TrueDepth para desbloquear el dispositivo, autenticación y pagos.
Batería: Hasta 20 horas de reproducción de video y hasta 80 horas de reproducción de audio.
Conectividad: 5G, Wi-Fi 6E (802.11ax) con MIMO, Bluetooth 5.3, NFC (solo para Apple Pay).
Sistema operativo: Originalmente con iOS 17, actualizable a versiones posteriores.
Resistencia al agua y polvo: Certificación IP68 (resistente al agua hasta 6 metros durante 30 minutos).
Carga inalámbrica: Compatible con cargadores MagSafe y Qi.
Carga rápida: Capaz de cargar hasta un 50% en 30 minutos con un cargador de 20 W o superior (no incluido en la caja).
Dimensiones: 160.9 x 77.8 x 7.8 mm.
Peso: 201 gramos.
Materiales: Cristal Ceramic Shield en la parte delantera, cristal texturizado en la parte trasera, con bordes de aluminio.
Colores disponibles Negro, blanco, azul, verde y rosa.
Otros Altavoces estéreo con soporte para Dolby Atmos, eliminación del conector de auriculares de 3.5 mm, soporte para Dual SIM (Nano SIM y eSIM).
Condión: Semi Nuevo', '{"Estado": "Seminuevo", "_history": [{"at": 1776372311928, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 650000}, {"at": 1776372276895, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 650000}, {"at": 1776373183556, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 650000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376582739, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 650000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780085082846, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 690000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 128, "price": 690000, "stock": 1, "oldPrice": 1300000}, {"gb": 256, "price": 710000, "stock": 1, "oldPrice": 1300000}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "Negro", "Azul", "Verde", "Titanio Blanco", "Oro", "Rosa", "Rojo"]}'::jsonb, '[]'::jsonb, '[{"hex": "#1f1f1f", "name": "Negro"}, {"hex": "#4f6d8a", "name": "Azul"}, {"hex": "#7aa37a", "name": "Verde"}, {"hex": "#e8e8e6", "name": "Titanio Blanco"}, {"hex": "#e6c992", "name": "Oro"}, {"hex": "#f4b6c2", "name": "Rosa"}, {"hex": "#c0392b", "name": "Rojo"}]'::jsonb, '["128 GB", "256 GB"]'::jsonb, NULL, true, '2026-04-16 20:44:37.350758+00', '2026-05-29 20:04:44.274922+00'),
('4125f3cd-6783-403d-a67d-57878b61489e', 'custom-1776371657429', NULL, 'iPhone 13 Pro Max', 'iphone', 'iPhone', 'seminuevo', 560000, NULL, 1, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371644846-1776371644846-62.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371644846-1776371644846-62.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371644846-1776371647612-63.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371644846-1776371649421-64.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371644846-1776371650194-65.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776371644846-1776371651322-66.png"]'::jsonb, 'El iPhone 13 Pro Max es el modelo de gama alta más grande de Apple en la línea de dispositivos móviles. Con una pantalla Super Retina XDR de 6.7 pulgadas, el dispositivo ofrece una experiencia de visualización impresionante con colores vibrantes y detalles nítidos. Además, cuenta con un sistema de cámara triple de 12 megapíxeles con tecnología de estabilización óptica de imagen, que te permite tomar fotos y videos con calidad profesional incluso en condiciones de poca luz. La cámara también tiene la capacidad de grabar videos en calidad 4K a 60 cuadros por segundo y cuenta con nuevas características, como el modo de fotografía ProRAW y el modo de video ProRes, que brindan más opciones de edición y un mayor control creativo.

El iPhone 13 Pro Max también cuenta con el chip A15 Bionic, el chip más rápido en un smartphone hasta el momento, que permite un rendimiento increíblemente rápido y eficiente. Además, el dispositivo cuenta con conectividad 5G, lo que te permite navegar por la web, descargar aplicaciones y transmitir videos a velocidades extremadamente rápidas. El dispositivo también cuenta con una batería duradera y la capacidad de carga rápida inalámbrica, lo que significa que podrás disfrutar del dispositivo durante todo el día sin preocuparte por quedarte sin energía. 

En resumen, el iPhone 13 Pro Max es la mejor opción para aquellos que buscan un dispositivo móvil de alta calidad con características avanzadas, una experiencia de usuario inigualable y una pantalla más grande para ver y crear contenido de manera más cómoda.', 'Pantalla: Super Retina XDR de 6.7 pulgadas, con resolución de 2778 x 1284 píxeles (458 ppi), tecnología OLED, HDR10, Dolby Vision, True Tone y amplia gama de colores (P3). Soporta ProMotion con una tasa de refresco adaptativa de hasta 120 Hz.
Procesador: Apple A15 Bionic (seis núcleos, 64 bits) con motor neuronal de 16 núcleos.
Memoria RAM: 6 GB.
Almacenamiento interno: 128 GB, 256 GB, 512 GB o 1 TB (no expandible).
Cámara trasera: Sistema de triple cámara de 12 MP:Lente gran angular: Apertura f/1.5, estabilización óptica de imagen (OIS).
Lente ultra gran angular: Apertura f/1.8, campo de visión de 120°.
Lente teleobjetivo: Apertura f/2.8, estabilización óptica de imagen (OIS), zoom óptico 3x.
Sensor LiDAR: Mejora el enfoque automático en condiciones de poca luz y permite capacidades avanzadas de realidad aumentada (AR).
Grabación de video 4K a 24, 30 o 60 fps, Dolby Vision HDR en grabación, modo Cinemático para video, modo nocturno, Deep Fusion, Smart HDR 4, modo Retrato con control de profundidad, iluminación de retrato.
Cámara frontal: 12 MP, apertura f/2.2, grabación de video 4K a 24, 30 o 60 fps, modo Cinemático para video, modo nocturno, Deep Fusion, Smart HDR 4, slo-mo (Slofies).
Face ID: Reconocimiento facial mediante la cámara TrueDepth para desbloquear el dispositivo, autenticación y pagos.
Batería: 4,352 mAh (no removible), con autonomía de hasta 28 horas en reproducción de video y hasta 95 horas en reproducción de audio.
Conectividad: 5G, 4G LTE Advanced, Wi-Fi 6 (802.11ax) con MIMO, Bluetooth 5.0, NFC (solo para Apple Pay).
Sistema operativo: Originalmente con iOS 15, actualizable a versiones posteriores.
Carga inalámbrica: Compatible con cargadores Qi y MagSafe.
Carga rápida: Capaz de cargar hasta un 50% en 30 minutos con un cargador de 20 W o superior (no incluido en la caja).
Dimensiones: 160.8 x 78.1 x 7.65 mm.
Peso: 238 gramos.
Materiales: Cristal Ceramics Shield en la parte delantera, cristal texturizado en la parte trasera, con bordes de acero inoxidable.
Colores disponibles: Grafito, plata, oro y azul sierra.
Otros: Altavoces estéreo con soporte para Dolby Atmos, eliminación del conector de auriculares de 3.5 mm, soporte para Dual SIM (Nano SIM y eSIM).
Condición: Semi Nuevo.', '{"Estado": "Seminuevo", "_history": [{"at": 1776371657428, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 560000}, {"at": 1776373194447, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 560000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376338442, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 560000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780085570823, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 560000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 128, "price": 560000, "stock": 0, "oldPrice": null}, {"gb": 256, "price": 580000, "stock": 0, "oldPrice": null}, {"gb": 512, "price": 630000, "stock": 0, "oldPrice": null}, {"gb": 1024, "price": 720000, "stock": 1, "oldPrice": 1200000}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "Grafito", "Oro", "Titanio Azul", "Verde"]}'::jsonb, '[]'::jsonb, '[{"hex": "#4a4a4a", "name": "Grafito"}, {"hex": "#e6c992", "name": "Oro"}, {"hex": "#6b7a8f", "name": "Titanio Azul"}, {"hex": "#7aa37a", "name": "Verde"}]'::jsonb, '["128 GB", "256 GB", "512 GB", "1 TB"]'::jsonb, NULL, true, '2026-04-16 20:34:18.032416+00', '2026-05-29 20:12:51.449433+00'),
('68b89e17-45a0-4b09-b8a0-bbaace6fb4a9', 'custom-1776373076478', NULL, 'iPhone 17', 'iphone', 'iPhone', 'seminuevo', 800000, 890000, 1, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776373059877-1776373059877-142.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776373059877-1776373059877-142.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776373059877-1776373061126-143.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776373059877-1776373061812-144.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776373059877-1776373062691-145.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776373059877-1776373063403-146.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776373059877-1776373064483-147.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776373059877-1776373065153-148.png"]'::jsonb, 'Estrena el iPhone 17 y disfruta, de entrada, una pantalla Super Retina XDR de 6,3" con ProMotion que se siente ultra fluida en apps, juegos y redes sociales. Su diseño resistente con Ceramic Shield y certificación IP68 está pensado para la vida real, mientras que el chip de nueva generación ofrece rendimiento rápido y batería para todo el día sin complicarte.

Para tus contenidos, la cámara principal de alta resolución captura fotos detalladas y video 4K con gran estabilidad; además, los retratos con control de profundidad y la frontal mejorada elevan tus selfies y videollamadas. Con USB-C, MagSafe y Qi2, cargar y usar tus accesorios es simple, y con Spatial Audio cada clip y canción suena más inmersivo.

Con Entel, activas 5G en minutos mediante eSIM (sin bandeja SIM física), y, por si fuera poco, aprovechas Wi-Fi y Bluetooth de última generación para conexiones rápidas en casa y en el trabajo. Elige tu color favorito y compra online con Entel Chile: si buscas una experiencia completa y cómoda en el día a día, el iPhone 17 te sube de nivel desde el primer toque.

Llévalo hoy en Entel y recibe asistencia para activar tu eSIM, configurar tu iPhone y estrenar tu 5G sin vueltas.

Vive la experiencia 5G de Entel en este móvil
¡Dile adiós al lag y hola a una conexión jamás vista! Con el 5G de Entel podrás descargar videos diez veces más rápido, transmitir sin intermitencias y jugar casi en tiempo real.
No solo es internet móvil, es 5G de Entel.', 'Pantalla: Super Retina XDR display, OLED de 6.3 pulgadas (diagonal) all-screen, resolución 2622 × 1206 píxeles a 460 ppi, Dynamic Island, pantalla siempre activa, ProMotion hasta 120 Hz, HDR display, True Tone, amplia gama de colores (P3), Haptic Touch, contraste típico 2,000,000:1, 1000 nits brillo típico, 1600 nits pico HDR, 3000 nits pico exterior, recubrimiento antihuellas y antirreflectante.

• Procesador: Apple A19 chip, CPU de 6 núcleos (2 rendimiento y 4 eficiencia), GPU de 5 núcleos con Neural Accelerators, Neural Engine de 16 núcleos, hardware-accelerated ray tracing.


• Memoria RAM: 8GB RAM


• Almacenamiento interno: 256 GB, 512 GB, no expandible.


• Cámara trasera: Sistema de cámara dual Fusion de 48 MP, 48 MP Fusion Main (26 mm) con apertura ƒ/1.6, estabilización óptica por desplazamiento del sensor, 100 % Focus Pixels, soporte para fotos de superalta resolución 24 MP y 48 MP, 48 MP Fusion Ultra Wide (13 mm) con apertura ƒ/2.2 y 120° FOV, teleobjetivo óptico 2× de calidad óptica (52 mm) con estabilización, 4× rango óptico total, zoom digital hasta 10×, Photonic Engine, Deep Fusion, Smart HDR 5, panorama hasta 63 MP, macro 48 MP.


• Cámara frontal: Cámara TrueDepth de 18 MP con apertura ƒ/1.9, autofocus con Focus Pixels, Retina Flash, Center Stage para fotos y video, ultra-estabilización de video, Deep Fusion, Smart HDR 5, grabación de video 4K Dolby Vision.


• Face ID: Face ID habilitado por tecnología TrueDepth para desbloqueo, autenticación y pagos.


• Batería: Batería de ion-litio recargable integrada, reproducción de video hasta 30 horas, reproducción de video en streaming hasta 27 horas, reproducción de audio hasta 105 horas, carga rápida hasta 50 % en 20 min con adaptador de 40 W o más (USB-C) o en 30 min con adaptador de 30 W o más (MagSafe).


• Conectividad: 5G NR sub-6 GHz y mmWave con MIMO 4×4, Gigabit LTE con MIMO 4×4, Apple N1 chip de conectividad, Wi-Fi 7 (802.11be) con MIMO 2×2, Bluetooth 6, Thread networking tech, Apple second generation Ultra Wideband chip, NFC con modo lector, Express Cards con reserva de energía, GPS de precisión dual-frecuencia.


• Sistema operativo: iOS 26 de fábrica, actualizable a versiones posteriores.


• Resistencia al agua y polvo: Certificación IP68, resistente hasta 6 metros de profundidad hasta 30 minutos (IEC 60529).

• Carga inalámbrica: Compatible con MagSafe inalámbrico hasta 25 W, Qi2 hasta 25 W, Qi hasta 7.5 W.


• Carga rápida: Hasta 50 % de carga en aproximadamente 20 min con adaptador de 40 W o superior (USB-C), hasta 50 % en aproximadamente 30 min con adaptador de 30 W o superior (MagSafe).


• Puerto: USB-C para carga y transferencia de datos, soporte para DisplayPort y USB 2 estándar.


• Dimensiones: 149.6 × 71.5 × 7.95 mm.


• Peso: 177 gramos.


• Materiales: Diseño con marco de aluminio, parte frontal Ceramic Shield 2, parte posterior de vidrio con infusión de color.


• Colores disponibles: Negro, Blanco, Mist Blue, Sage, Lavender.


• Otros: Action Button, altavoces estéreo, soporte para Emergency SOS via satellite, Crash Detection, Dual eSIM con opción de múltiples eSIMs.

Condición: Semi Nuevo', '{"Estado": "Seminuevo", "_history": [{"at": 1776373076477, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 880000}, {"at": 1776373173108, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 880000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376836376, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 880000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780084153073, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 800000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 256, "price": 800000, "stock": 1, "oldPrice": 890000}, {"gb": 512, "price": 913000, "stock": 0, "oldPrice": 1000000}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "Gris Espacial", "Azul Alpino", "Blanco", "Grafito", "Verde", "Rosado"]}'::jsonb, '[]'::jsonb, '[{"hex": "#4a4a4a", "name": "Gris Espacial"}, {"hex": "#5b7c99", "name": "Azul Alpino"}, {"hex": "#f1f1f1", "name": "Blanco"}, {"hex": "#4a4a4a", "name": "Grafito"}, {"hex": "#7aa37a", "name": "Verde"}, {"hex": "#f4b6c2", "name": "Rosado"}]'::jsonb, '["256 GB", "512 GB"]'::jsonb, NULL, true, '2026-04-16 20:57:57.036009+00', '2026-05-29 19:49:13.913187+00'),
('d75564dd-81d1-4085-85a3-6d75829e6462', 'custom-1776373287583', NULL, 'iPhone 17 Pro', 'iphone', 'iPhone', 'seminuevo', 1186000, 1300000, 10, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776373277416-1776373277416-155.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776373277416-1776373277416-155.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776373277416-1776373278451-156.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776373277416-1776373279538-157.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776373277416-1776373280386-158.png"]'::jsonb, 'El iPhone 17 Pro redefine lo profesional con su nuevo chip A19 Pro y 12 GB de RAM, capaz de enfrentar con facilidad edición de video, juegos demandantes y multitarea pesada.

Su pantalla Super Retina XDR OLED de 6,3 pulgadas ofrece brillo extremo al aire libre (~3000 nits), soporte HDR completo, tasa de refresco ProMotion de 120 Hz y diseño Always-On, todo para que la experiencia visual sea impecable.

El sistema de cámaras presenta tres lentes Fusion de 48 MP (gran angular, ultra gran angular y teleobjetivo), zoom óptico de hasta 8×, y cámara frontal de 18 MP con Center Stage, permitiendo capturar imágenes de gran calidad y videos profesionales en cualquier condición.

La batería da un salto considerable en duración, con muchas más horas de reproducción de video y mejor eficiencia térmica gracias al nuevo diseño con cámara de vapor, además de carga rápida, inalámbrica y MagSafe.

Resistente al agua y al polvo con clasificación IP68, acabado en aluminio premium y disponible en colores sofisticados como Cosmic Orange, Azul Profundo y Plata, el iPhone 17 Pro combina lo mejor en rendimiento, diseño y fotografía para usuarios que exigen lo máximo.', 'Pantalla: Super Retina XDR de 6.3 pulgadas, resolución 2622 × 1206 píxeles (460 ppi), tecnología OLED, HDR, True Tone, amplia gama de colores (P3), ProMotion hasta 120 Hz, pantalla siempre activa, Dynamic Island, contraste 2,000,000:1 (típico), 1000 nits máximo (típico), 1600 nits pico (HDR), 3000 nits pico (exterior), 1 nit mínimo, recubrimiento antirreflectante.
Procesador: Apple A19 Pro, CPU de 6 núcleos (2 rendimiento y 4 eficiencia), GPU de 6 núcleos con Neural Accelerators, Neural Engine de 16 núcleos, trazado de rayos acelerado por hardware.
Memoria RAM: 12 GB.
Almacenamiento interno: 256 GB, 512 GB, 1 TB, no expandible.
Cámara trasera: Sistema Pro Fusion de 48 MP, cámara principal 48 MP (24 mm) con apertura ƒ/1.78, estabilización óptica por desplazamiento del sensor (segunda generación), ultra gran angular 48 MP (13 mm) con apertura ƒ/2.2 y 120°, teleobjetivo 48 MP (100 mm, 4×) con apertura ƒ/2.8 y diseño tetraprisma, zoom digital hasta 40×, grabación de video 4K Dolby Vision a 24/25/30/60 fps, Apple Log 2, ProRes y ProRes RAW, cuatro micrófonos de calidad de estudio, reducción de ruido de viento, Audio Mix.
Cámara frontal: Cámara Center Stage de 18 MP, apertura ƒ/1.9, autoenfoque con Focus Pixels, modo Noche, Deep Fusion, Smart HDR 5, grabación 4K Dolby Vision a 24/25/30/60 fps, modo Cinemático hasta 4K Dolby Vision a 30 fps, ProRes RAW, Apple Log 2.
Face ID: TrueDepth integrado en la cámara frontal Center Stage.
Batería: Hasta 33 horas de reproducción de video, hasta 30 horas de reproducción de video en streaming, carga rápida hasta 50% en 20 minutos con adaptador de 40 W o superior (con cable USB-C), batería recargable integrada de ion-litio.
Conectividad: 5G (sub-6 GHz y mmWave) con 4×4 MIMO, Wi-Fi 7 (802.11be) con 2×2 MIMO, Bluetooth 6, Thread, chip UWB de segunda generación, NFC con modo lector, Express Cards con power reserve.
Sistema operativo: iOS 26 de fábrica, actualizable a versiones posteriores.
Resistencia al agua y polvo: IP68, hasta 6 metros durante 30 minutos (IEC 60529).
Carga inalámbrica: MagSafe hasta 25 W, Qi2 hasta 25 W.
Carga rápida: Hasta 50% en 20 minutos con adaptador de 40 W o superior (con cable USB-C), hasta 50% en 30 minutos con adaptador de 30 W o superior con MagSafe.
Puerto: USB-C, DisplayPort, USB 3 hasta 10 Gb/s.
Dimensiones: 150.0 × 71.9 × 8.75 mm.
Peso: 206 g.
Materiales: Diseño unibody de aluminio, Ceramic Shield 2 frontal, Ceramic Shield posterior.
Colores disponibles: Silver, Cosmic Orange, Deep Blue.', '{"Estado": "Seminuevo", "_history": [{"at": 1776373287583, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 1250000}, {"at": 1776373959196, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 1250000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776374876653, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 1250000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776374906014, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 1250000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376070749, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 1250000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376146938, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 1250000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780084466600, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 1186000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 256, "price": 1186000, "stock": 10, "oldPrice": 1300000}, {"gb": 512, "price": 1500000, "stock": 0, "oldPrice": null}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "Blanco", "Ultramarino", "Coral"]}'::jsonb, '[]'::jsonb, '[{"hex": "#bdbdbd", "name": "Naranja"}, {"hex": "#f1f1f1", "name": "Blanco"}, {"hex": "#2f3e5c", "name": "Ultramarino"}, {"hex": "#ff6f55", "name": "Coral"}]'::jsonb, '["256 GB", "512 GB"]'::jsonb, NULL, true, '2026-04-16 21:01:28.20087+00', '2026-05-29 19:54:27.480664+00'),
('9faeb803-24d4-4d72-abb4-fd18a31d869a', 'custom-1776372412141', NULL, 'iPhone 15 Pro', 'iphone', 'iPhone', 'seminuevo', 740000, NULL, 1, 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372399593-1776372399593-108.png', '["https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372399593-1776372399593-108.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372399593-1776372401286-109.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372399593-1776372402520-110.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372399593-1776372403256-111.png", "https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/products/new-1776372399593-1776372403885-112.png"]'::jsonb, 'iPhone 15 Pro. Forjado en titanio y equipado con el revolucionario chip A17 Pro, un Botón de Acción personalizable y el sistema de cámaras Pro más versátil.


FORJADO EN TITANIO  El iPhone 15 Pro tiene un diseño resistente y liviano, con titanio de calidad aeroespacial y parte posterior de vidrio mate texturizado. Frente de Ceramic Shield, más duro que el vidrio más duro de cualquier smartphone. Y resistencia a las salpicaduras, al agua y al polvo.
PANTALLA AVANZADA La pantalla Super Retina XDR de 6,1 pulgadas con ProMotion aumenta la frecuencia de actualización hasta 120 Hz cuando necesitas el máximo rendimiento gráfico. La Dynamic Island muestra alertas y Actividades en Vivo al instante. Y la pantalla siempre activa te permite tener información siempre a la vista sin mover un dedo.
REVOLUCIONARIO CHIP A17 PRO Con la GPU de nivel pro, los juegos móviles son más inmersivos, con escenarios llenos de detalles y personajes más realistas. Y el chip A17 Pro es tan eficiente que la batería es capaz de seguirte el ritmo todo el día.
SISTEMA DE CÁMARAS PRO Multiplica tus opciones de encuadre con 7 lentes pro. Toma fotos en súper alta resolución con más colores y detalles que nunca con la cámara gran angular de 48 MP. Y haz primeros planos súper nítidos desde más lejos con la cámara teleobjetivo de 3× del iPhone 15 Pro.
BOTÓN DE ACCIÓN PERSONALIZABLE  El Botón de Acción te lleva volando a tu funcionalidad favorita, como el modo Silencio, Cámara, Nota de Voz o Atajos. Configúralo con la que quieras usar y mantenlo presionado para que haga su magia.
CONEXIONES MUY PRO  La nueva entrada USB-C te permite cargar tu Mac o iPad con el mismo cable que usas para cargar el iPhone 15 Pro. Con USB 3, las velocidades de transferencia pisan el acelerador a fondo. Y con la conexión WiFi 6E, podrás descargar archivos hasta el doble de rápido.
FUNCIONALIDADES ESENCIALES DE SEGURIDAD Con Detección de Choques, el iPhone puede identificar si sufres un accidente automovilístico grave y pedir ayuda cuando tú no puedes.
INNOVACIONES QUE MARCAN LA DIFERENCIA  El iPhone cuenta con tecnologías de privacidad que te ayudan a mantener el control de tus datos. Está fabricado con más materiales reciclados para reducir su impacto medioambiental. Y viene con funcionalidades integradas que lo hacen accesible para todo el mundo.', 'Pantalla: Super Retina XDR de 6.1 pulgadas, con resolución de 2556 x 1179 píxeles (460 ppi), tecnología OLED, HDR10, Dolby Vision, True Tone y amplia gama de colores (P3). Soporta Dynamic Island y una tasa de refresco adaptativa de hasta 120 Hz.
Procesador: Apple A17 Pro (seis núcleos, 64 bits) con motor neuronal de 16 núcleos y GPU de alto rendimiento.
Memoria RAM: 8 GB.
Almacenamiento interno: 128 GB, 256 GB, 512 GB o 1 TB (no expandible).
Cámara trasera: Sistema de triple cámara de 48 MP:Lente gran angular: 48 MP con apertura f/1.78, estabilización óptica de imagen (OIS).
Lente ultra gran angular: 12 MP con apertura f/2.2, campo de visión de 120°.
Lente teleobjetivo: 12 MP con apertura f/2.8, estabilización óptica de imagen (OIS), zoom óptico 5x.
Sensor LiDAR: Mejora el enfoque automático en condiciones de poca luz y permite capacidades avanzadas de realidad aumentada (AR).
Grabación de video 4K a 24, 30 o 60 fps, Dolby Vision HDR en grabación, modo Cinemático para video, ProRAW, ProRes video, modo nocturno, Deep Fusion, Smart HDR 4.
Cámara frontal: 12 MP, apertura f/1.9, grabación de video 4K a 24, 30 o 60 fps, modo Cinemático para video, modo nocturno, Deep Fusion, Smart HDR 4, slo-mo (Slofies).
Face ID: Reconocimiento facial mediante la cámara TrueDepth para desbloquear el dispositivo, autenticación y pagos.
Batería: Hasta 23 horas de reproducción de video y hasta 75 horas de reproducción de audio.
Conectividad: 5G, Wi-Fi 6E (802.11ax) con MIMO, Bluetooth 5.3, NFC (solo para Apple Pay), USB-C con soporte para Thunderbolt 4.
Sistema operativo: Originalmente con iOS 17, actualizable a versiones posteriores.
Resistencia al agua y polvo: Certificación IP68 (resistente al agua hasta 6 metros durante 30 minutos).
Carga inalámbrica: Compatible con cargadores MagSafe y Qi.
Carga rápida: Capaz de cargar hasta un 50% en 30 minutos con un cargador de 20 W o superior (no incluido en la caja).
Dimensiones: 146.6 x 70.6 x 8.3 mm.
Peso: 221 gramos.
Materiales: Titanio en el marco, cristal Ceramic Shield en la parte delantera, cristal texturizado en la parte trasera.
Colores disponibles: Titanio, gris oscuro, plata y azul.
Otros: Altavoces estéreo con soporte para Dolby Atmos, eliminación del conector de auriculares de 3.5 mm, soporte para Dual SIM (Nano SIM y eSIM).
Condición: Semi Nuevo.', '{"Estado": "Seminuevo", "_history": [{"at": 1776372412140, "note": "Registro inicial de inventario", "type": "create", "title": "Producto creado", "amount": 700000}, {"at": 1776373181169, "note": "Cambio de estado desde acciones rapidas", "type": "published", "title": "Producto publicado", "amount": 700000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1776376610145, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 700000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}, {"at": 1780085032662, "note": "Cambios guardados desde el editor", "type": "update", "title": "Producto editado", "amount": 740000, "actor_id": "7a470a69-042a-4d24-97fa-e32b3968930a", "actor_email": "tomasdominguezcarrizo.23@gmail.com"}], "_variants": [{"gb": 128, "price": 752000, "stock": 1, "oldPrice": 1299000}, {"gb": 256, "price": 740000, "stock": 0, "oldPrice": null}, {"gb": 512, "price": 800000, "stock": 0, "oldPrice": null}, {"gb": 1000, "price": 860000, "stock": 0, "oldPrice": null}], "Categoría": "iPhone", "_colorImages": {}, "_imageColors": ["", "Negro", "Blanco", "Azul Alpino", "Titanio Natural"]}'::jsonb, '[]'::jsonb, '[{"hex": "#1f1f1f", "name": "Negro"}, {"hex": "#f1f1f1", "name": "Blanco"}, {"hex": "#5b7c99", "name": "Azul Alpino"}, {"hex": "#b9b3a9", "name": "Titanio Natural"}]'::jsonb, '["128 GB", "256 GB", "512 GB", "1000 GB"]'::jsonb, NULL, true, '2026-04-16 20:46:52.610546+00', '2026-05-29 20:03:53.077953+00');

insert into public.site_assets (id, asset_type, asset_key, title, image_url, sort_order, is_active, created_at, updated_at) values
('e4424732-8201-4e4c-a4ec-d5a438dcec75', 'banner', NULL, 'banner', 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/web-assets/banner/1774657822207-1681718797-2692.jpg', 0, true, '2026-03-28 00:30:26.565167+00', '2026-03-28 00:30:26.565167+00'),
('f3c70c98-6d42-4e5c-bbd6-fc90531f1472', 'banner', NULL, 'banner 3', 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/web-assets/banner/1774657994527-apple-y-sus-dispositivos-de-2022.1696930177.0349.webp', 2, true, '2026-03-28 00:33:17.649833+00', '2026-03-28 00:33:17.649833+00'),
('174b8888-3c35-46e2-901f-91bd956875b1', 'logo', NULL, 'Banner', 'https://fnwimtjrfmygbyeqvevs.supabase.co/storage/v1/object/public/product-images/web-assets/logo/1780173529443-asset-adjust-1780173529443.png', 0, true, '2026-05-30 20:37:35.960943+00', '2026-05-30 20:38:50.882282+00');

insert into public.tradein_categories (id, name, img_url, active, created_at, updated_at) values
('iphone', 'iPhone', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=160&h=160&fit=crop&q=80', true, '2026-03-27 14:31:57.180708+00', '2026-03-27 14:31:57.180708+00'),
('imac', 'iMac', 'https://images.unsplash.com/photo-1527443224154-c4bbf5b8f4ff?w=160&h=160&fit=crop&q=80', true, '2026-03-27 14:31:57.180708+00', '2026-03-27 14:31:57.180708+00'),
('accesorios', 'Accesorios', 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=160&h=160&fit=crop&q=80', true, '2026-03-27 14:31:57.180708+00', '2026-03-27 14:31:57.180708+00'),
('macbook', 'MacBook', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=160&h=160&fit=crop&q=80', true, '2026-03-27 14:31:57.180708+00', '2026-03-27 14:31:57.180708+00'),
('ipad', 'iPad', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=160&h=160&fit=crop&q=80', true, '2026-03-27 14:31:57.180708+00', '2026-03-27 14:31:57.180708+00'),
('watch', 'Apple Watch', 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=160&h=160&fit=crop&q=80', true, '2026-03-27 14:31:57.180708+00', '2026-03-27 14:31:57.180708+00'),
('videojuegos', 'Videojuegos', 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=160&h=160&fit=crop&q=80', true, '2026-03-27 14:31:57.180708+00', '2026-03-27 14:31:57.180708+00'),
('camaras', 'Cámaras', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=160&h=160&fit=crop&q=80', true, '2026-03-27 14:31:57.180708+00', '2026-03-27 14:31:57.180708+00'),
('drones', 'Drones', 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=160&h=160&fit=crop&q=80', true, '2026-03-27 14:31:57.180708+00', '2026-03-27 14:31:57.180708+00');

insert into public.tradein_models (id, category_id, name, year, base, img_url, capacities, active, created_at, updated_at) values
('s8', 'watch', 'Apple Watch Series 8', NULL, 160000, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=320&h=320&fit=crop&q=80', '[32, 64]'::jsonb, true, '2026-03-27 14:31:57.180708+00', '2026-03-27 17:23:06.224813+00'),
('dji', 'drones', 'DJI Mini', NULL, 320000, 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=320&h=320&fit=crop&q=80', '[]'::jsonb, true, '2026-03-27 14:31:57.180708+00', '2026-03-27 17:23:06.610096+00'),
('imac24', 'imac', 'iMac 24"', NULL, 890000, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=320&h=320&fit=crop&q=80', '[256, 512, 1024]'::jsonb, true, '2026-03-27 14:31:57.180708+00', '2026-03-27 17:23:06.617266+00'),
('gopro', 'camaras', 'GoPro Hero', NULL, 180000, 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=320&h=320&fit=crop&q=80', '[32, 64, 128]'::jsonb, true, '2026-03-27 14:31:57.180708+00', '2026-03-27 17:23:06.630777+00'),
('ipad10', 'ipad', 'iPad 10.ª gen.', NULL, 180000, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=320&h=320&fit=crop&q=80', '[64, 256]'::jsonb, true, '2026-03-27 14:31:57.180708+00', '2026-03-27 17:23:06.646962+00'),
('ip13', 'iphone', 'iPhone 13', '2021', 220000, 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=320&h=320&fit=crop&q=80', '[128, 256, 512]'::jsonb, true, '2026-03-27 14:31:57.180708+00', '2026-03-27 17:23:06.663081+00'),
('ps4', 'videojuegos', 'PlayStation 4', NULL, 150000, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=320&h=320&fit=crop&q=80', '[500, 1000]'::jsonb, true, '2026-03-27 14:31:57.180708+00', '2026-03-27 17:23:06.691568+00'),
('airpods', 'accesorios', 'AirPods Pro', NULL, 120000, 'https://images.unsplash.com/photo-1606220945770-b2b6ce2aef0e?w=320&h=320&fit=crop&q=80', '[]'::jsonb, true, '2026-03-27 14:31:57.180708+00', '2026-03-27 17:23:06.674684+00'),
('ip11', 'iphone', 'iPhone 11', '2019', 140000, 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=320&h=320&fit=crop&q=80', '[64, 128, 256]'::jsonb, true, '2026-03-27 14:31:57.180708+00', '2026-03-27 17:23:06.683414+00'),
('mba-m2', 'macbook', 'MacBook Air M2', NULL, 720000, 'https://images.unsplash.com/photo-1661961112951-fadf717756d6?w=320&h=320&fit=crop&q=80', '[256, 512, 1024]'::jsonb, true, '2026-03-27 14:31:57.180708+00', '2026-03-27 17:23:06.693247+00'),
('ip6s', 'iphone', 'iPhone 6S', '2015', 20000, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=320&h=320&fit=crop&q=80', '[16, 32, 64, 128]'::jsonb, true, '2026-03-27 14:31:57.180708+00', '2026-03-27 17:23:06.689076+00');

insert into public.tradein_settings (id, increment_per_tier, fixed_deduction, min_percent_floor, created_at, updated_at)
values (1, 12000, 8000, 0.350, '2026-03-27 14:31:57.180708+00', '2026-03-27 17:23:05.896052+00')
on conflict (id) do update set
  increment_per_tier = excluded.increment_per_tier,
  fixed_deduction = excluded.fixed_deduction,
  min_percent_floor = excluded.min_percent_floor,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

commit;

-- Bucket de fotos. Si esta parte falla, el stock de arriba ya quedó guardado.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update
set public = true,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public_read_product_images" on storage.objects;
drop policy if exists "editor_insert_product_images" on storage.objects;
drop policy if exists "editor_update_product_images" on storage.objects;
drop policy if exists "admin_delete_product_images" on storage.objects;
create policy "public_read_product_images"
on storage.objects for select to anon, authenticated
using (bucket_id = 'product-images');
create policy "editor_insert_product_images"
on storage.objects for insert to authenticated
with check (bucket_id = 'product-images' and public.is_product_editor());
create policy "editor_update_product_images"
on storage.objects for update to authenticated
using (bucket_id = 'product-images' and public.is_product_editor())
with check (bucket_id = 'product-images' and public.is_product_editor());
create policy "admin_delete_product_images"
on storage.objects for delete to authenticated
using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "products_public_read_catalog" on public.products;
create policy "products_public_read_catalog"
on public.products for select to anon, authenticated
using (published = true);

select
  (select count(*) from public.products) as productos,
  (select count(*) from public.products where published and stock > 0) as con_stock,
  (select count(*) from public.site_assets) as banners_y_logo;
