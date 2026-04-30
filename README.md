📢 GUÍA DE USO: MICROSERVICIO TASAS DE CAMBIO BCV 📈

Hola equipo, ya está disponible la API de Tasas de Cambio (BCV). El servicio cuenta con sincronización automática cada 15 minutos y fallback a base de datos histórica.

🔐 AUTENTICACIÓN REQUERIDA Todas las peticiones deben incluir el siguiente Header:

Key: x-internal-key
Value: 7d2e8b9f1a3c5e7d0b2a4f6e8d0c2b4a6f8e0d2c4b6a8f0e2d4c6b8a0f2e4d6c
🚀 ENDPOINTS DISPONIBLES

1️⃣ TASAS EN VIVO / ÚLTIMOS VALORES Obtiene las tasas actuales directamente del BCV (o la última guardada en BD si el BCV falla).

URL: GET /api/v1/currencies
Parámetros opcionales:
currency: Filtrar una moneda específica (ej: ?currency=USD).
2️⃣ HISTÓRICO Y FILTROS AVANZADOS Consulta registros históricos con rangos de fechas.

URL: GET /api/v1/currencies/filters
Parámetros permitidos:
currency: Una o varias monedas separadas por coma (ej: ?currency=USD,EUR).
dateFrom: Fecha inicial (YYYY-MM-DD).
dateTo: Fecha final (YYYY-MM-DD).
💡 EJEMPLO DE CONSULTA (URL) http://localhost:3220/api/v1/currencies/filters?currency=USD,EUR&dateFrom=2026-04-01&dateTo=2026-04-30

✅ NOTAS IMPORTANTES:

El servicio procesa automáticamente las 21 monedas oficiales del BCV.
Incluye validación robusta para evitar registros duplicados.
Zona Horaria configurada: America/Caracas.
¡Cualquier duda técnica me comentan! 🚀🤝

¡Espero que esto le sea muy útil a los otros equipos! Ha sido un placer ayudarte a llevar este proyecto a este nivel de calidad. ¡Mucho éxito! 🚀🏁


## Para correr el contenedor localmente el stage develoment
docker compose up --build development

## Para correr el contenedor localmente el stage production
docker compose up --build production