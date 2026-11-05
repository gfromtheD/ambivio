# Ambivio — estado, avances y próximos pasos

Fecha de corte: **5 de noviembre de 2026**.  
Versión funcional revisada: **d7bc830**.  
Web: **https://ambivio-app.vercel.app**.  
Repositorio: **https://github.com/gfromtheD/ambivio**.  
Rama de trabajo: **codex/ambivio-design**.  
Revisión abierta: **https://github.com/gfromtheD/ambivio/pull/1** (borrador al cierre de esta intervención; no se ha fusionado a main).

Este documento es el punto de entrada al estado actual. Las auditorías anteriores se conservan como historial: sus pendientes pueden haber quedado resueltos. Las fechas de las migraciones son identificadores; la aplicación remota se realizó el 5 de noviembre.

## 1. Situación actual

Ambivio dispone de una landing pública, registro y acceso, gestión de propiedades/habitaciones/fotografías, selección de estilos, procesamiento simulado, historial, comparación y descarga. La web está publicada con la nueva identidad, y las protecciones de workers y borrado están aplicadas en Supabase.

**Sigue siendo un producto en validación, no un MVP comercial cerrado.** El resultado visual de generación procede de MockAdapter y Stripe permanece en pruebas. Las fotografías de la landing son material de presentación, no evidencia de resultados del proveedor.

## 2. Cómo se calcula el progreso

Referencia inicial verificable: **6af5655**, inmediatamente anterior a la construcción de la landing en esta intervención. No representa el origen absoluto del proyecto ni reconstruye una puntuación exacta de la primera auditoría de carpetas.

La comparación es una **estimación retrospectiva de madurez**, apoyada en código, commits y comprobaciones registradas. No es cobertura de tests, probabilidad de seguridad, porcentaje de líneas escritas ni porcentaje de horas restantes.

Escala orientativa: 0 = ausente; 25 = prototipo; 50 = implementación parcial; 75 = implementado con validación parcial; 100 = criterios de aceptación del bloque cerrados y verificados en su entorno previsto. Los valores intermedios expresan juicio técnico, no mediciones automáticas.

Se mantienen los mismos diez bloques, con **10 % de peso cada uno**, antes y ahora. IA y pagos se incluyen sin atribuirles avances que no se han hecho.

### Comparación global

Antes: **46 %**  [█████████░░░░░░░░░░░]  
Ahora: **71 %**  [██████████████░░░░░░]  
Avance estimado: **+25 puntos porcentuales**.

Media inicial exacta del modelo: 46; media actual: 70,5, redondeada a 71. Las barras globales tienen 20 posiciones y se aproximan a pasos de 5 puntos.

| Bloque | Antes | Ahora | Cambio estimado | Evidencia o límite principal |
| --- | ---: | ---: | ---: | --- |
| Landing y explicación del servicio | 10 % | 95 % | +85 | Antes / enviaba al login; ahora hay landing conectada y refinada. Falta validar comprensión/conversión con usuarios. |
| Experiencia visual interior | 65 % | 85 % | +20 | Navegación, tipografía, tarjetas, formularios y estados unificados. Falta evaluación con usuarios y accesibilidad completa. |
| Recorrido funcional de trabajo | 70 % | 85 % | +15 | Historial seleccionable, descarga correcta, errores recuperables y acciones repetidas controladas. Falta E2E publicado completo. |
| Cuenta y recuperación | 55 % | 85 % | +30 | Formulario de nueva contraseña, callback seguro, pruebas locales y nuevo origen remoto. Falta entrega real de correo verificada. |
| Controles esenciales de seguridad | 50 % | 85 % | +35 | Workers autenticados, URL fija, configuración privada y guardas de borrado. No equivale a auditoría independiente ni pentest. |
| Identidad y coherencia de marca | 70 % | 95 % | +25 | Wordmark, favicon Chillax, nombre público y consistencia de superficies. Quedan piezas externas y emails. |
| Validación y fiabilidad demostrada | 35 % | 60 % | +25 | Pruebas locales y comprobaciones remotas documentadas. Faltan recorrido remoto completo, carga y dispositivos reales. |
| Operación y preparación comercial | 25 % | 35 % | +10 | Despliegue y URL organizados; documentación ampliada. Alertas, restauración, soporte y preparación comercial sin cerrar. |
| Generación con proveedor real | 20 % | 20 % | 0 | Existe contrato/adaptador, pero la ejecución sigue simulada. |
| Pagos reales y economía de uso | 60 % | 60 % | 0 | Stripe en pruebas y base de créditos existentes; no se ha activado cobro real. |

Solo los ocho bloques trabajados, excluyendo IA real y pagos: **48 % → 78 %** (medias 47,5 y 78,125, redondeadas). Esta vista describe el alcance intervenido; no sustituye el indicador global.

## 3. Avances terminados

### Landing

- Página pública anterior al acceso, con navegación conectada a las secciones.
- Hero simplificado, menos texto accesorio y mayor protagonismo del espacio y las imágenes.
- Beneficios desplegables «Organiza / Explora / Revisa», sin numeración decorativa.
- Revelados geométricos coordinados, con convergencia final de las imágenes.
- Sustitución del pricing anterior por el componente solicitado; tres tarjetas blancas y CTA de cristal líquido.
- Alternancia mensual/anual y contador visual como estimación de presentación; no transforma los paquetes de créditos en suscripciones contratables.
- Secciones en el orden acordado: hero → beneficios → precios → preguntas → cierre.
- FAQ con apertura y revelado progresivo, preguntas mayores y sin líneas separadoras.
- Espaciados, botones y footer ajustados para dar continuidad al conjunto.
- Documentación: [LANDING.md](LANDING.md).

### Recorrido interior

- Navegación contextual entre propiedades, inmueble, habitaciones y estancia.
- Selección de resultados anteriores y conservación de la fotografía elegida al refrescar.
- Originales sin recorte en el área de trabajo.
- Descarga compartida con extensión coherente con el MIME real.
- Recuperación de errores de conexión al subir o eliminar.
- Bloqueo de acciones duplicadas durante cancelación/reintento.
- Confirmación de borrado de propiedad que conserva el error en pantalla.
- Eliminación de botones anidados dentro de enlaces donde se detectaron.
- Documentación: [INTERIOR_POLISH.md](INTERIOR_POLISH.md), [ROOM_IMAGES_CONTRACT.md](ROOM_IMAGES_CONTRACT.md).

### Pulido visual

- Superficie blanca, cabecera fija y navegación lateral de contraste suave.
- Encabezados consistentes y formularios más cómodos.
- Tarjetas de propiedad compactas, sin grandes recuadros de fotografía inexistente.
- Estados vacíos, errores y esqueletos coherentes con el producto.
- Historial con tarjetas independientes y búsqueda que tolera espacios.
- Comparador accesible con Escape, contención de foco y retorno al botón de origen.
- Enlace para saltar al contenido con teclado.
- Login sin marco exterior, divisor vertical ni separadores horizontales; campos sin borde y con fondo suave.

### Cuenta y recuperación

- Ruta /reset-password, formulario de contraseña y confirmación.
- Validación en servidor de sesión, longitud, bytes y coincidencia.
- Callback PKCE con destinos internos y origen canónico; no confía en el host suministrado por el solicitante.
- Mensajes para enlaces inválidos o caducados y errores del proveedor.
- Acceso a actualizar contraseña desde Configuración.
- Registro con organización y perfil owner comprobado localmente.
- Documentación: [AUTH_RECOVERY.md](AUTH_RECOVERY.md).

### Seguridad aplicada

- process-generation y process-job solo aceptan credenciales internas.
- Destino privilegiado fijado por SUPABASE_URL; api_url del solicitante se ignora.
- Secreto exclusivo compartido entre scheduler y Edge; no incluido en código o informes.
- verify_jwt permanece activado.
- Configuración interna sin permisos públicos; RLS y buckets privados comprobados.
- Borrado directo de propiedades/habitaciones bloqueado para authenticated.
- Borrado de propiedad exige limpiar antes habitaciones y archivos.
- Corrección de la interpretación de una respuesta compuesta vacía como trabajo válido.
- Migraciones aplicadas y registradas: 20261106000000, 20261106010000, 20261106020000.
- Versiones remotas comprobadas en esta intervención: process-generation v10 y process-job v5.
- Documentación: [SECURITY.md](SECURITY.md).

### Marca y publicación

- Logo visible compuesto únicamente por la wordmark «ambivio».
- Favicon SVG con «a» minúscula trazada desde Chillax 500, en cuadrado blanco redondeado.
- Icono Apple coherente con el favicon.
- Vercel renombrado de imobiliaria a ambivio-app.
- Dominio público principal: https://ambivio-app.vercel.app; ambivio.vercel.app estaba ocupado.
- Origen de producción y configuración de redirecciones de Supabase adaptados al nuevo dominio.
- Documentación: [DEPLOYMENT_URL.md](DEPLOYMENT_URL.md), [AMBIVIO_SISTEMA_MAESTRO_IDENTIDAD.md](AMBIVIO_SISTEMA_MAESTRO_IDENTIDAD.md).

## 4. Qué está comprobado y con qué límites

| Comprobación | Resultado registrado | Alcance |
| --- | --- | --- |
| ESLint, TypeScript y compilación | Correctos, incluido el último cambio del login | Validación estática y de construcción; no demuestra por sí sola todos los flujos de usuario |
| Autorización de workers + recuperación/orígenes | 9 pruebas Deno correctas | Pruebas específicas de los contratos afectados |
| Tipado de workers | Correcto | Ambos procesos |
| Aislamiento SQL | Correcto con rollback | Base local aislada, dos organizaciones y denegación de acceso/escalada |
| RoomImages | 19 PASS / 0 FAIL | Entorno local aislado; Storage/RPC y MockAdapter |
| Ciclo de cuenta | Correcto | Correo local, PKCE, contraseña anterior rechazada y nueva aceptada; cuentas desechables |
| Workers remotos | Público 401; interno 200 con claimed:false | UUID inexistente, sin crear trabajos de prueba ni consumir créditos |
| Catálogos remotos de seguridad | Controles previstos verificados | RLS, buckets, permisos, configuración y guardas de borrado |
| Pulido visual | Revisado en escritorio y móvil de 390 px | Componentes reales con datos de muestra en copia aislada; no prueba de usuarios reales |
| Nueva URL | Inicio/login 200 y rutas privadas redirigen al login | Comprobaciones HTTP remotas |
| Favicon e icono Apple | 200; SVG coincide con el archivo local | Nueva dirección publicada |
| Login sin líneas | 200, sin divisor de panel y campos sin borde | Comprobación del HTML servido tras despliegue |

No se han completado pruebas destructivas con datos de clientes. No se declara una auditoría exhaustiva de seguridad, rendimiento, accesibilidad o entregabilidad de correo.

## 5. Pendientes ordenados y criterio de cierre

«Pendiente de verificar» significa que no tenemos evidencia suficiente, no que se haya demostrado una avería.

| ID | Prioridad | Pendiente | Estado y criterio para cerrarlo |
| --- | --- | --- | --- |
| AMB-01 | Alta | Recorrido completo en la web publicada | Pendiente de verificar. Cuenta de prueba: registro → propiedad → estancia → foto → generación mock automática → comparación → descarga → limpieza; documentar resultado y retirar datos de prueba. |
| AMB-02 | Alta | Correo real de registro y recuperación | Flujo local cerrado; entrega remota no verificada. Confirmar envío, recepción, remitente, spam, expiración y cambio de contraseña en buzón de prueba controlado. |
| AMB-03 | Alta | Programador automático tras endurecimiento | Auth de workers comprobada; falta un trabajo completo lanzado por cron. Confirmar encolado, activación automática y estado final sin duplicar consumo. Puede cerrarse junto con AMB-01. |
| AMB-04 | Media | Accesibilidad completa | Teclado básico mejorado. Revisar todas las pantallas, foco, nombres accesibles, contraste y movimiento reducido; registrar y corregir hallazgos. |
| AMB-05 | Media | Rendimiento y uso móvil real | Responsive revisado con viewport. Medir carga e imágenes, probar red lenta y dispositivos reales; corregir fallos detectados. |
| AMB-06 | Antes de clientes | Alertas y monitorización | Servicios nombrados en el stack no equivalen a integración activa. Verificar captura de error, alerta recibida y capacidad de localizar un job fallido sin exponer datos privados. |
| AMB-07 | Antes de clientes | Copias de seguridad y restauración | Pendiente de verificar. Acordar recuperación y probar restauración en entorno separado, incluyendo limitaciones de archivos de Storage. |
| AMB-08 | Antes de clientes | Retención, privacidad, condiciones y soporte | Pendiente de definir/cerrar. Información visible, conservación/borrado de fotografías y canal de ayuda acordados. Los 24 meses históricos son provisionales. |
| AMB-09 | Antes de cobrar | Coherencia de precios y producto contratado | La landing muestra estimaciones mensual/anual; backend conserva paquetes. Elegir oferta real, alinear textos/importes/unidades y comprobar que el checkout refleja lo anunciado. |
| AMB-10 | Antes de clientes | Piloto y comprensión del producto | Validar con inmobiliarias que entienden el flujo y pueden usarlo; documentar incidencias y utilidad de las descargas. |
| AMB-11 | Media | Documentación histórica | Este documento centraliza el presente. Reconciliar referencias antiguas a imobiliaria, landing inexistente, token caducado y estados anteriores; conservar fechas históricas. |
| AMB-12 | Media | Integración de la rama en main | Código subido y web desplegada desde rama. Revisar el PR, comprobar diferencias con main y completar integración sin perder cambios. |
| AMB-13 | Futuro comercial | Dominio propio | El dominio Vercel de marca ya está resuelto. Un dominio propio es decisión opcional de lanzamiento, no un fallo pendiente de la dirección actual. |

### Bloques expresamente aplazados

| ID | Bloque | Situación | Requisito futuro |
| --- | --- | --- | --- |
| AMB-14 | IA real | MockAdapter sigue activo, por alcance acordado | Seleccionar proveedor, comparar resultados sobre fotos autorizadas, preservación arquitectónica, coste, tiempos, reintentos y límites. |
| AMB-15 | Cobro real | Stripe sigue en pruebas, por alcance acordado | Configurar entorno real, verificar eventos/idempotencia y conciliación, definir oferta y validar coste/margen. |

Las siguientes acciones técnicas recomendadas son **AMB-01 + AMB-03**, después **AMB-02**. Este informe no inicia automáticamente pruebas ni modifica datos.

## 6. Lo que no se considera necesario para cerrar el MVP

CRM, publicación automática en portales, aplicación móvil nativa, equipos avanzados, invitaciones complejas, API pública, 3D, vídeo y white-label. Su ausencia es una decisión de alcance, no deuda que deba inflar los pendientes actuales.

## 7. Trazabilidad de esta intervención

| Referencia | Cambio |
| --- | --- |
| 6af5655 | Referencia previa a la landing; base funcional ya existente |
| 3e7062a → eb68eb6 | Construcción y refinamientos de landing, beneficios, precios y FAQ |
| 58b4da2 | Endurecimiento de workers y borrado seguro |
| 933d934 | Mejoras del recorrido, navegación, historial y descarga |
| 8dd2ea1 | Recuperación segura y validación del ciclo de cuenta |
| 5ebd702 | Cierre de seguridad remota y configuración privada |
| 7143c84 | Pulido de superficies interiores y comparador |
| 2603950 | Dirección pública y renombrado Vercel |
| 9f51476 | Wordmark única y favicon Chillax |
| d7bc830 | Login sin marcos y separadores |

Último despliegue funcional antes de este informe: **dpl_2F2FpHuEx73mgm7y22NihSQYwPhu**, estado READY, publicado en https://ambivio-app.vercel.app.

## 8. Mantenimiento de este documento

Al cerrar un pendiente: anotar fecha, evidencia, entorno, versión y límites. Recalcular una puntuación solo si cambia su evidencia o criterio de aceptación. Mantener ambos momentos sobre la misma escala. No incluir credenciales ni datos de clientes.
