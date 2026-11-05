# Landing pública de Ambivio

La ruta `/` presenta la landing pública. El proxy existente mantiene la redirección de usuarios autenticados a `/properties`; el login, registro y servicios internos conservan sus rutas y contratos.

## Componentes

- `components/ui/liquid-glass-navbar.tsx`: Nimbus Waterline, recurso de 21st.dev proporcionado por el propietario (autor indicado en la fuente: guglielmogiannattasio.it). Conserva el shader y navegación líquida; adapta tono, fuente y accesibilidad al producto.
- `components/ui/squishy-card-component.tsx`: tarjeta animada facilitada por el propietario, con Framer Motion; parametrizada por paquete y adaptada a la paleta monocromática.
- `components/ui/connoisseur-stack-interactor.tsx`: selector fotográfico facilitado por el propietario, con GSAP; adapta contenido, máscaras, teclado y movimiento reducido. El revelado se detiene con la imagen visible para permitir su lectura.
- `components/landing/landing-interactions.tsx`: composición cliente. La galería se carga por separado; el contenido principal se genera en servidor.

## Contenido y conexiones

Se reutilizan `CREDIT_PACKAGES` de `lib/stripe.ts` como única fuente de precios (pago único, no suscripción mensual). Los CTA enlazan con `/register`; los enlaces de acceso con `/login`. No se inicia checkout desde la landing ni se altera facturación.

La generación comercial con proveedor real sigue en validación. No se anuncian resultados de IA a partir de fotografías de archivo.

## Fotografías

Archivos alojados en `public/images`, descargados de Unsplash para esta landing. No son resultados generados ni una comparación antes/después:

- `salon.jpg`: identificador CDN `photo-1600210492486-724fe5c67fb0`.
- `dormitorio.jpg`: identificador CDN `photo-1611892440504-42a792e24d32`.
- `comedor.jpg`: identificador CDN `photo-1617806118233-18e1de247200`.

Las URL CDN de origen son `https://images.unsplash.com/{identificador}?auto=format&fit=crop&w=1800&q=85`. Sustituir esta colección por ejemplos reales validados cuando estén disponibles.

## Identidad

Se aplica `docs/AMBIVIO_SISTEMA_MAESTRO_IDENTIDAD.md`: Satoshi y Chillax locales, sistema monocromático y wordmark reutilizado. Las interacciones respetan movimiento reducido. No se incorporan familias de iconos nuevas.


## Ajuste editorial posterior

Hero reducido a titular y fotografía a gran escala. CTA único en cabecera: «Descubrir Ambivio» hacia el login existente (que ofrece acceso al registro). Se eliminan etiquetas introductorias, explicaciones pequeñas y el bloque Organiza/Explora/Revisa. FAQ en columna centrada. Cada paquete tiene una composición geométrica y respuesta propia, con texto y dibujo separados. Las tres máscaras fotográficas terminan revelando el encuadre completo, sin huecos; movimiento reducido presenta directamente la imagen completa.
