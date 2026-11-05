# Cuenta y recuperación

## Flujo

1. `/forgot-password` solicita un correo con PKCE hacia `/auth/callback?next=/reset-password`.
2. El callback canjea el código, conserva las cookies de sesión y permite únicamente `/properties`, `/settings` o `/reset-password` como destino.
3. `/reset-password` exige una sesión validada con `getUser`. Sin sesión o ante enlace inválido muestra cómo pedir otro enlace.
4. La acción `updatePasswordAction` valida longitud, límite de bytes del proveedor y coincidencia antes de llamar a `updateUser({ password })` con la sesión del usuario. Nunca usa service role para modificar contraseñas.
5. Tras el cambio muestra confirmación y acceso a Propiedades. Configuración también ofrece un acceso al formulario.

## Configuración

- Producción debe definir `NEXT_PUBLIC_SITE_URL` con el origen HTTPS canónico, sin rutas.
- Mantener ese origen y su `/auth/callback` en la lista de redirecciones autorizadas de Supabase. Esta tarea no pudo comprobar la configuración remota por caducidad del acceso administrativo.
- En desarrollo se conserva el host de bucle local y el puerto de la solicitud; evita intercambiar localhost con 127.0.0.1 durante el canje.
- No confiar en `x-forwarded-host` enviado por el solicitante para elegir el destino.
- El registro respeta si Supabase requiere confirmar el correo: muestra el mensaje de confirmación si no hay sesión y entra directamente si el proveedor ya la ha emitido.
- Errores de registro y envío se traducen a mensajes de usuario; no se devuelve la respuesta interna del proveedor.

## Pruebas

- `pnpm dlx deno test supabase/functions/_shared/auth_flow_test.ts`: destinos internos, origen canónico, contraseña y confirmación.
- `scripts/validate-auth.local.mjs` solo admite Supabase en `127.0.0.1:56321` y app en `127.0.0.1:3002`, con un buzón Mailpit local en 56324. Crea cuentas desechables y las elimina al terminar.
- La prueba local ejecuta las acciones reales de recuperación y registro: correo, PKCE, canje en Next.js, formulario autenticado, guardado por Server Action, contraseña anterior rechazada, nueva aceptada, enlace caducado y redirección maliciosa.
- Ejecución: `node --env-file=<archivo-local-de-pruebas> scripts/validate-auth.local.mjs`.
- No ejecutar contra datos reales ni sustituir los destinos fijos por un proyecto alojado.
