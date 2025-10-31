# SyncNote (Escritorio)

Aplicación de escritorio (Electron + React + Vite + TypeScript) para crear notas con categorías y listas de tareas completables, con sincronización en Firebase.

## Requisitos

- Node.js 18+
- Cuenta y proyecto en Firebase (Firestore + Authentication)

## Configuración

1. Crea un proyecto en Firebase y habilita:
   - Authentication (proveedor Anónimo)
   - Firestore (modo production o test)
2. Copia las credenciales WEB del proyecto y crea un archivo `.env` en la raíz con:

```
VITE_FIREBASE_API_KEY=TU_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=TU_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=TU_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=TU_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=TU_SENDER_ID
VITE_FIREBASE_APP_ID=TU_APP_ID
# Opcional: usar emuladores locales
VITE_USE_FIREBASE_EMULATORS=false
```

## Desarrollo

- Instala dependencias y corre en modo desarrollo:

```bash
npm install
npm run dev
```

Esto lanzará Vite y luego abrirá la app Electron apuntando a `http://localhost:5173`.

## Build

```bash
npm run build
```

Generará los artefactos de escritorio con electron-builder en la carpeta `dist` y los empaquetados en `dist`/`release` según tu OS.

## Estructura básica

- `electron/` proceso principal y preload
- `src/` React + servicios Firebase
- `src/services/hooks.ts` hooks para auth y notas/tareas
- `src/types/models.ts` tipos compartidos

## Notas de seguridad

- No expongas credenciales sensibles en el repositorio. Usa `.env` local.
- Para producción, configura reglas de seguridad en Firestore para restringir a `users/{uid}/notes/**` al usuario autenticado.