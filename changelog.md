# Changelog

## [2026-04-30] - Sección de Privacidad (Meta Compliance)

### Descripción del cambio
- Creada `app/privacy/page.tsx`: Página de política de privacidad con diseño premium alineado al resto del sitio.
- Incluye cláusulas específicas sobre recolección de datos, uso de IA (Claude/RAG) e integración oficial con la API de Meta Cloud.
- Actualizado el footer en `app/page.tsx` para vincular correctamente a la nueva página de privacidad.
- Requisito mandatorio para la aprobación de la aplicación en el portal de desarrolladores de Meta (Embedded Signup).

### Motivo técnico/estético
- **Cumplimiento Legal**: Requerido por Meta para el flujo de onboarding de WhatsApp e Instagram.
- **Transparencia**: Informar a los usuarios sobre cómo se procesan sus datos mediante IA y APIs externas.

### Pasos para revertir
1. Eliminar `app/privacy/page.tsx`.
2. Restaurar el link original en `app/page.tsx`.

## [2026-04-30] - Fase 1 completa: Agente IA + RAG + Dashboard Premium

### Cambios
- `app/api/knowledge/route.ts`: GET/POST/DELETE para chunks con embeddings OpenAI `text-embedding-3-small`.
- `app/api/agent/route.ts`: PATCH para actualizar `agent_name`, `agent_tone`, `business_context` del tenant.
- `app/dashboard/layout.tsx`: Layout con sidebar oscuro premium, navegación entre secciones.
- `app/dashboard/page.tsx`: Rediseño dark mode con stats y inbox preview.
- `app/dashboard/agente/page.tsx`: UI cliente para configurar agente + gestión completa de knowledge base.

### Revertir
- Eliminar `app/api/knowledge/`, `app/api/agent/`, `app/dashboard/layout.tsx`, `app/dashboard/agente/`.
- Restaurar `app/dashboard/page.tsx` desde git.

## [2026-04-30] - Hero Cinemático con GSAP ScrollTrigger

### Descripción del cambio
- Creado `components/ui/cinematic-hero.tsx`: hero fullscreen con animación cinemática GSAP + ScrollTrigger.
- El hero muestra mock de WhatsApp (Vendly IA) dentro de un iPhone 3D con parallax por mouse.
- Reemplazado el hero estático de `app/page.tsx` por `<CinematicHero />`.
- Instaladas dependencias: `gsap`, `clsx`, `tailwind-merge`, `lucide-react`.
- Creado `lib/utils.ts` con función `cn()`.
- Añadida variable CSS `--color-foreground` en `globals.css`.

### Motivo técnico/estético
- **WOW Factor**: Scroll timeline de 7000px que revela una tarjeta profunda azul oscuro/verde con iPhone flotante, badges glassmorphism y CTA final.
- Textos en español adaptados a la marca Vendly.

### Pasos para revertir
1. Restaurar la sección `{/* ── Hero ── */}` original en `app/page.tsx`.
2. Eliminar `components/ui/cinematic-hero.tsx`.
3. Eliminar `lib/utils.ts` si no se usa en otro lugar.


## [2026-04-30] - Análisis del Proyecto y Creación del Roadmap

### Descripción del cambio
- Se realizó un análisis exhaustivo del código actual de Vendly, revisando la landing page, el esquema de base de datos Supabase, y la estructura de los componentes y webhooks.
- Se elaboró un roadmap de implementación detallado estructurado en 5 fases (IA & RAG, Meta API, Dashboard Premium, Monetización, y Despliegue) diseñado como un artefacto markdown.

### Motivo técnico/estético
- **Planificación Estratégica**: Para asegurar una ejecución ordenada del desarrollo hacia una solución SaaS operativa y vendible.
- **Identificación de Brechas**: Se validó que el Front-End y Base de Datos están sólidos, estableciendo que el siguiente gran paso es conectar la lógica de IA y Webhooks.

### Pasos para revertir
- No aplica (solo generación de documento de Roadmap).

## [2026-04-28] - Mejora de UX/UI en Landing Page (Premium First)

### Descripción del cambio
- Se analizó el proyecto Vendly y se implementó una mejora significativa en la interfaz de usuario de la landing page.
- Se añadieron estilos en Vanilla CSS en `app/globals.css` para crear efectos de "glassmorphism", animaciones de fondo (orbes brillantes), y micro-interacciones avanzadas (hover effects, glows).
- Se actualizaron los componentes en `app/page.tsx` para utilizar estas nuevas clases premium.

### Motivo técnico/estético
- **Estética WOW**: Se aplicaron principios de diseño premium modernos, evitando diseños planos. Se incorporaron sombras dinámicas, bordes iluminados y fondos con desenfoque (`backdrop-filter`) para dar profundidad.
- **Cumplimiento de Reglas**: Siguiendo la directriz de usar Vanilla CSS como estándar para estilos complejos y estéticos, se centralizaron los estilos premium en el archivo global.

### Pasos para revertir
1. Restaurar `app/globals.css` al commit anterior (eliminar las clases `.premium-glass`, `.glow-button`, etc.).
2. Restaurar `app/page.tsx` al commit anterior.
