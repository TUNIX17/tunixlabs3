# TunixLabs

Sitio web oficial de TunixLabs, una consultora de Inteligencia Artificial con sistema de tesorería integrado para el Curso 7i.

## Características

- Página principal de la empresa de consultoría en IA con servicios destacados
- Sistema de tesorería para el Curso 7i con funcionalidades completas:
  - Panel de administración con autenticación
  - Formularios para registro de transacciones (ingresos y gastos)
  - Visualización y filtrado de transacciones
  - Gestión de usuarios y permisos
- Diseño responsive con Tailwind CSS optimizado para todos los navegadores
- Arquitectura moderna con Next.js y React
- Implementación de componentes reutilizables
- Sistema preparado para integración con APIs y bases de datos

## Tecnologías

- **Next.js 13+** - Framework de React con App Router
- **React 18** - Biblioteca JavaScript para construir interfaces de usuario
- **Tailwind CSS** - Framework de utilidades CSS para diseño rápido
- **TypeScript** - Superset de JavaScript con tipado estático
- **UUID** - Generación de identificadores únicos
- **Vercel** - Plataforma de despliegue

## Instalación

1. Clona el repositorio
```bash
git clone https://github.com/TUNIX17/tunixlabs.git
```

2. Instala las dependencias
```bash
cd tunixlabs
npm install
```

3. Configura las variables de entorno (si es necesario)
```bash
cp .env.example .env.local
# Edita .env.local con tus configuraciones
```

4. Inicia el servidor de desarrollo
```bash
npm run dev
```

5. Abre [http://localhost:3000/inicio](http://localhost:3000/inicio) en tu navegador para ver la aplicación.

## Estructura del Proyecto

```
/src
  /app                     # Rutas y páginas (App Router)
    /inicio                # Página principal de TunixLabs
    /curso7i               # Sistema de tesorería para el Curso 7i
      /admin               # Panel de administración con autenticación
    layout.tsx             # Layout principal con navegación y pie de página
    page.tsx               # Redirección a la página de inicio
  /components              # Componentes reutilizables
    /curso7i               # Componentes específicos del sistema de tesorería
      LoginForm.tsx        # Formulario de inicio de sesión
      TransactionForm.tsx  # Formulario para registrar transacciones
      TransactionTable.tsx # Tabla para visualizar transacciones
    Navbar.tsx             # Barra de navegación
    Footer.tsx             # Pie de página
  /styles                  # Estilos globales
    globals.css            # Configuración de Tailwind y estilos personalizados
  /types                   # Definiciones de tipos
```

## Uso del Sistema de Tesorería

1. Navega a [http://localhost:3000/curso7i](http://localhost:3000/curso7i) para ver el panel general
2. Para acceder a la administración, ve a [http://localhost:3000/curso7i/admin](http://localhost:3000/curso7i/admin)
3. Credenciales de prueba:
   - Email: admin@tunixlabs.com
   - Contraseña: admin123

## Comandos Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila la aplicación para producción
- `npm run start` - Inicia la aplicación compilada
- `npm run lint` - Ejecuta el linter para verificar errores

## Despliegue

La aplicación está configurada para ser desplegada en Vercel.

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno necesarias
3. Despliega automáticamente en cada push a la rama principal

## Dominio

- Nombre: tunixlabs.com
- IP Address: 50.31.188.183
- Hosting: BanaHosting

## Información para Desarrollo

- La aplicación utiliza Next.js 13+ con App Router
- Los estilos son implementados con Tailwind CSS y variables CSS personalizadas
- Se ha optimizado para compatibilidad con todos los navegadores
- El sistema de autenticación es simulado actualmente (para implementación real en el futuro)

## Contacto

Para más información, contactar a TUNIX17.

---

## Licencia

Este proyecto es propiedad de TunixLabs. 