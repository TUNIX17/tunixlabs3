# PRD: TunixLabs Portfolio - Sprint de Finalizacion

## Vision del Producto

**TunixLabs** es el portfolio profesional de consultoria en IA, mostrando:
- Servicios de IA y automatizacion
- Robot 3D interactivo con voz (demo de capacidades)
- Proyectos y casos de exito

**Objetivo del Sprint:** Limpiar, pulir y lanzar en Railway.

---

## Estado Actual (Enero 2025)

### Completado
- Robot 3D con 6 animaciones (waving, dancing, nodding, etc.)
- Sistema de voz: grabacion → Groq STT → LLM → Web Speech TTS
- 9 paginas de servicios completas
- Landing page con animacion de red neuronal
- Deteccion automatica de 14 idiomas

### Limpieza Completada (2025-01-05)
- ~~Referencias a curso7i en Navbar.tsx y Footer.tsx~~ ELIMINADAS
- Navbar y Footer actualizados con nuevos enlaces
- README.md actualizado
- CONCLUSION.md eliminado
- vercel.json limpiado

### Pendiente de Mejora
- translator.ts sin implementar
- RobotInspector.tsx incompleto (debugging)
- Groq TTS no funciona (fallback a Web Speech API)

---

## Epics para Sprint de Finalizacion

### E001: Limpieza de Codigo
**Prioridad:** P0 (Critico)
**Esfuerzo:** 1 hora

**User Stories:**
- US-001: Como desarrollador, quiero eliminar todas las referencias a curso7i para tener un codigo limpio
- US-002: Como desarrollador, quiero eliminar codigo muerto y archivos no usados

**Tareas:** COMPLETADAS
1. ~~Eliminar referencias comentadas a /curso7i en Navbar.tsx~~ DONE
2. ~~Eliminar referencias comentadas a /curso7i en Footer.tsx~~ DONE
3. ~~Eliminar documentacion obsoleta de ARCHITECTURE.md~~ DONE
4. ~~Verificar que no haya otras referencias ocultas~~ DONE

**Acceptance Criteria:**
- [x] grep -r "curso7i" no retorna resultados (solo PRD.md)
- [ ] Aplicacion compila sin errores
- [ ] Todas las rutas funcionan

---

### E002: Pagina de Contacto
**Prioridad:** P1 (Alta)
**Esfuerzo:** 2 horas

**User Stories:**
- US-003: Como visitante, quiero poder contactar a TunixLabs desde la web

**Tareas:**
1. Revisar estado actual de /contacto
2. Habilitar ruta en navegacion
3. Implementar formulario de contacto (o integrar Formspree/EmailJS)
4. Agregar validacion con Zod
5. Disenar estados: loading, success, error

**Acceptance Criteria:**
- [ ] Formulario visible y accesible
- [ ] Validacion client-side funciona
- [ ] Mensaje de exito al enviar
- [ ] Responsive en mobile

---

### E003: Mejoras al Robot
**Prioridad:** P2 (Media)
**Esfuerzo:** 3 horas

**User Stories:**
- US-004: Como visitante, quiero que el robot sea mas expresivo y atractivo
- US-005: Como visitante, quiero instrucciones claras de como interactuar

**Tareas:**
1. Agregar tooltip/instrucciones de interaccion
2. Mejorar animacion inicial (saludar automaticamente)
3. Agregar indicador visual de "habla conmigo"
4. Optimizar carga del modelo 3D (preload)
5. Agregar mas variedad de respuestas del robot

**Acceptance Criteria:**
- [ ] Usuario entiende como interactuar sin explicacion
- [ ] Robot saluda al cargar la pagina
- [ ] Indicador visual de microfono activo

---

### E004: Seccion de Portfolio/Proyectos
**Prioridad:** P1 (Alta)
**Esfuerzo:** 4 horas

**User Stories:**
- US-006: Como visitante, quiero ver proyectos reales de TunixLabs

**Tareas:**
1. Crear pagina /proyectos o /portfolio
2. Disenar tarjetas de proyecto (imagen, titulo, descripcion, tech stack)
3. Agregar 3-5 proyectos iniciales:
   - Sistema de tesoreria (curso7i) - ahora app independiente
   - Bot de automatizacion
   - Dashboard BI
   - Este mismo sitio web
4. Agregar a navegacion

**Acceptance Criteria:**
- [ ] Minimo 3 proyectos visibles
- [ ] Cada proyecto tiene imagen, descripcion y tecnologias
- [ ] Links a demos/repos donde aplique

---

### E005: Deployment Railway
**Prioridad:** P0 (Critico)
**Esfuerzo:** 2 horas

**User Stories:**
- US-007: Como usuario, quiero acceder a tunixlabs.com y ver el sitio

**Tareas:**
1. Crear proyecto en Railway
2. Configurar variables de entorno (GROQ_API_KEY)
3. Conectar repositorio GitHub
4. Configurar dominio tunixlabs.com
5. Verificar SSL y performance

**Acceptance Criteria:**
- [ ] Sitio accesible en tunixlabs.com
- [ ] HTTPS funcionando
- [ ] Robot y voz funcionan en produccion
- [ ] LCP < 3s

---

### E006: SEO y Metadata
**Prioridad:** P2 (Media)
**Esfuerzo:** 1 hora

**User Stories:**
- US-008: Como TunixLabs, quiero aparecer en Google

**Tareas:**
1. Agregar metadata a todas las paginas
2. Crear sitemap.xml
3. Agregar robots.txt
4. Configurar Open Graph para redes sociales
5. Agregar Google Analytics (opcional)

**Acceptance Criteria:**
- [ ] Cada pagina tiene title y description unicos
- [ ] Sitemap accesible en /sitemap.xml
- [ ] Preview correcto al compartir en LinkedIn/Twitter

---

## Cronograma Sugerido

| Sprint | Epics |
|--------|-------|
| Sprint 1 (Dia 1) | E001 Limpieza + E005 Railway |
| Sprint 2 (Dia 2) | E002 Contacto + E006 SEO |
| Sprint 3 (Dia 3) | E003 Robot + E004 Portfolio |

---

## Metricas de Exito

- [ ] Sitio live en tunixlabs.com
- [x] 0 referencias a curso7i (limpiado 2025-01-05)
- [ ] Robot interactivo funcionando
- [ ] Formulario de contacto operativo
- [ ] Minimo 3 proyectos en portfolio
- [ ] LCP < 3s en mobile

---

## Notas Tecnicas

### Variables de Entorno Requeridas
```
GROQ_API_KEY=gsk_...
NEXT_PUBLIC_APP_URL=https://tunixlabs.com
```

### Dominio
- tunixlabs.com actualmente en BanaHosting
- Configurar DNS para apuntar a Railway

### Limitaciones Conocidas
- Groq TTS no funciona (usar Web Speech API)
- Modelo GLB es pesado (~2MB) - considerar optimizacion futura
