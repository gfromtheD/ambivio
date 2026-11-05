# SECURITY.md

## 1. Objetivo

Definir las reglas mínimas de seguridad obligatorias para lanzar el SaaS.

---

## 2. Principio

Seguridad razonable para un SaaS comercial.

No implementar seguridad empresarial innecesaria.

Sí implementar correctamente:

- autenticación;
- autorización;
- RLS;
- secrets;
- validación de archivos;
- signed URLs;
- rate limiting;
- logging;
- eliminación de datos.

---

## 3. Secrets

Nunca exponer en frontend:

- AI API keys;
- Stripe secret;
- Supabase service role key;
- secrets internos.

Utilizar environment variables.

---

## 4. Browser

El browser únicamente recibe credenciales públicas que puedan exponerse según la arquitectura de Supabase.

Todo secreto permanece server-side.

---

## 5. RLS

RLS es obligatorio para tablas multi-tenant.

Un usuario de Organization A no puede acceder a:

Organization B.

Incluso si conoce:

- UUID;
- URL;
- nombre;
- ID de propiedad.

### Columnas sensibles (2026-08-16)

RLS no puede restringir columnas individuales; se usan grants de columna.

En `public.users` el rol `authenticated` solo puede `UPDATE` su propio `email`:

- `revoke update on public.users from authenticated;`
- `grant update (email) on public.users to authenticated;`
- policy `users: update self` con `with check (id = auth.uid() and organization_id = public.current_org_id())`.

`role` y `organization_id` no son modificables por el usuario (ni escalada de rol, ni org-hopping).

---

## 6. Authorization

No confiar únicamente en:

- botones ocultos;
- middleware;
- client-side checks.

Cada operación sensible debe verificar autorización server-side y/o mediante RLS.

### Créditos

El control y decremento de créditos ocurre exclusivamente en el backend.

El frontend nunca:

- descuenta créditos;
- decide entitlement;
- autoriza generaciones.

Si un usuario manipula el frontend:

el backend debe rechazar la generación cuando no exista crédito.

---

## 7. Uploads

Subida directa desde el navegador mediante Supabase Storage SDK.

Las políticas RLS de Storage deben garantizar aislamiento por organización:

- validar el prefijo de ruta {organization_id}/... contra la organización del usuario;
- ningún usuario puede listar/leer/escribir en carpetas de otras organizaciones.

Validar en backend:

- MIME;
- extensión;
- tamaño;
- formato;
- contenido cuando sea posible.

Límites iniciales:

- formatos: JPEG, PNG;
- tamaño máximo: 10 MB;
- resolución máxima: 4096 × 4096;
- máximo: 20 imágenes por propiedad.

La validación del backend es independiente de la validación visual del frontend.

No aceptar URLs arbitrarias como fuente de imágenes durante el MVP.

---

## 8. Storage

Buckets privados:

- original-images;
- staged-images.

Estructura:

- originales: {organization_id}/{property_id}/{image_id};
- resultados: {organization_id}/{property_id}/{image_id}/{job_id}.

Acceso mediante signed URLs:

- cortas para visualización;
- con expiración mayor para descarga.

Nunca exponer service_role al navegador.

No exponer rutas internas de Storage innecesariamente.

### Service role del Edge Worker (2026-08-16)

El Edge Worker `process-generation` usa `SUPABASE_SERVICE_ROLE_KEY` en producción:

- se inyecta como **secret del runtime de la función** (`supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...` o Dashboard → Edge Functions → Secrets);
- se lee con `Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")` en la función (ya implementado);
- no existe fallback a credenciales públicas ni passthrough del header entrante;
- nunca se commitea ni se expone al navegador.

---

## 9. Rate limiting

Implementado en PostgreSQL.

Sin Redis.

Límites a nivel de organización sobre:

- generaciones simultáneas;
- volumen de generaciones;
- consumo de créditos.

Los valores concretos deben mantenerse configurables.

No hardcodear límites de negocio en múltiples partes del código.

Aplicar límites también a:

- login;
- endpoints sensibles.

Especialmente generación IA.

---

## 10. Abuse protection

Prevenir:

- generación infinita;
- spam;
- loops;
- requests automatizados;
- consumo accidental masivo.

---

## 11. Stripe

Los webhooks deben:

- verificar firma;
- ser idempotentes;
- no confiar en datos del cliente.

---

## 12. AI

Nunca permitir que un usuario controle directamente:

- provider;
- API key;
- parámetros internos peligrosos.

El backend controla el pipeline.

---

## 13. Logging

Registrar eventos útiles:

- authentication failures;
- generation failures;
- authorization failures;
- excessive generation;
- storage failures.

Sin payloads sensibles:

- no registrar imágenes;
- no registrar API keys;
- no registrar passwords;
- no exponer información privada en analytics;
- no registrar datos personales innecesarios;
- no registrar secretos;
- no registrar información sensible en texto plano.

---

## 14. GDPR

El producto debe permitir:

- eliminación de cuenta;
- eliminación de propiedades;
- eliminación de imágenes;
- eliminación de resultados;
- mecanismos de retención.

### Retención

Política provisional de MVP:

24 meses como retención inicial.

Es una política técnica provisional, no una afirmación jurídica definitiva.

Revisar antes del despliegue comercial formal.

---

## 15. Data deletion

Eliminar una propiedad debe tener una política clara sobre:

- rooms;
- original images;
- generated images;
- generations;
- usage metadata.

Al eliminar una propiedad:

las imágenes asociadas (originales y generadas) se eliminan junto con la propiedad.

---

## 16. Error messages

No revelar información interna.

No mostrar:

- stack traces;
- secrets;
- nombres internos de infraestructura;
- API responses completas.

---

## 17. Dependencies

Mantener dependencias actualizadas razonablemente.

No añadir dependencias sin necesidad.

---

## 18. Security review

Antes de producción:

- comprobar RLS;
- comprobar secrets;
- comprobar uploads;
- comprobar Storage;
- comprobar Stripe webhooks;
- comprobar endpoints de generación;
- comprobar autorización.

---

## 19. Regla

Nunca sacrificar aislamiento multi-tenant para acelerar desarrollo.

## Endurecimiento de workers y borrado (2026-11)

Los workers ya no aceptan una URL de API controlada por el cuerpo. Solo usan SUPABASE_URL del entorno. Requieren una credencial interna: Authorization con la service role existente o X-Worker-Secret coincidente con WORKER_SHARED_SECRET. No aceptan una clave pública ni un JWT de usuario. No existe passthrough de credenciales entrantes a Storage. La configuración incompleta falla cerrada y los errores de RPC no se devuelven completos al solicitante.

Despliegue coordinado necesario: (1) generar un secreto aleatorio exclusivo de al menos 32 bytes, (2) guardar el mismo valor en el secreto de Edge WORKER_SHARED_SECRET y en app_config.worker_secret mediante acceso administrativo, (3) aplicar 20261106000000_worker_request_auth.sql para que los schedulers lo envíen, (4) desplegar process-generation y process-job, (5) comprobar una invocación interna y el rechazo de peticiones públicas. Mantener verify_jwt; no desactivar la protección del gateway. No publicar el secreto en archivos versionados ni en logs.

El borrado de propiedades reutiliza prepare/complete_room_deletion y la limpieza de Storage de cada habitación. La nueva migración 20261106010000_property_deletion_cleanup.sql impide el borrado directo por authenticated y exige que no queden habitaciones ni objetos privados. No cambia las reglas de consumo o devolución de créditos.

Validación local: worker_security_test.ts (autorización y destino fijo), Deno check de ambos workers y security_isolation.sql en una base aislada con rollback. La comprobación local no certifica que el servidor remoto haya aplicado estas migraciones.
