# Miguel Evangelista — Master Educator

Sitio web de **Miguel Evangelista**: scalp therapist, colorista y Master Educator.
Alisados de precisión, color de autor, terapia capilar y formación profesional en Viña del Mar.

## Estructura

```
index.html        Página completa
app.js            Banner, filtros de servicios, videos y formulario de cotización
*.webp            Fotografías
*.mp4             Videos (sin audio)
```

## Ver en local

```bash
python3 -m http.server 8000
```

Luego abre http://localhost:8000

## Formulario de cotización por WhatsApp

En `app.js`, completa la variable `WA_NUMERO` con el número de Miguel, con código de país y solo dígitos (ej. `56912345678`).
Mientras esté vacía, el formulario abre su enlace de WhatsApp sin el mensaje prellenado.

## Publicar con GitHub Pages

Settings → Pages → Source: *Deploy from a branch* → Branch: `main` / root.

## Pendiente

- Precios y duración de cada servicio (`[PRECIO]`, `[DURACIÓN]`).
- Biografía de Miguel en la sección "Sobre Miguel Evangelista".
