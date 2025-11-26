# La Biblioteca del Club de la Semilla

Este proyecto es una aplicación web moderna desarrollada con Vue 3 y TypeScript, diseñada para gestionar una biblioteca digital. La aplicación utiliza Firebase como backend y ofrece una interfaz de usuario moderna y responsiva.

## 🛠️ Tecnologías Principales

- Vue 3 - Framework de JavaScript progresivo
- TypeScript - Superset tipado de JavaScript
- Vite - Bundler y servidor de desarrollo
- Pinia - Gestión de estado
- Vue Router - Enrutamiento
- Firebase - Backend y autenticación
- Bootstrap 5 - Framework CSS
- SASS - Preprocesador CSS

## 🚀 Configuración del Proyecto

### Requisitos Previos

- Node.js (versión 20 o superior)
- npm (incluido con Node.js)
- Cuenta de Firebase (para desarrollo)

### Instalación

1. Clona el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd la-biblioteca-del-club-de-la-semilla
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
```
Edita el archivo `.env` con tus credenciales de Firebase.

### Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila el proyecto para producción
- `npm run test:unit` - Ejecuta las pruebas unitarias
- `npm run lint` - Ejecuta el linter
- `npm run format` - Formatea el código con Prettier

## 📁 Estructura del Proyecto

```
src/
├── assets/         # Recursos estáticos
├── components/     # Componentes Vue reutilizables
├── dtos/          # Objetos de transferencia de datos
├── firebase/      # Configuración de Firebase
├── model/         # Modelos y tipos
├── router/        # Configuración de rutas
├── stores/        # Stores de Pinia
└── views/         # Componentes de página
```

## 🤝 Contribuir al Proyecto

### 1. Preparación Inicial

Si eres nuevo en el proyecto, te recomendamos:

1. Familiarizarte con la estructura del proyecto
2. Revisar los componentes principales en `src/components/`
3. Entender el flujo de datos en `src/stores/`

### 2. Proceso de Contribución

1. **Escoger o crear un Issue**
   - Antes de comenzar a trabajar, escoge un issue
   - Si quieres crear uno nuevo describe tu propuesta usando el formato de user story: "COMO [persona], QUIERO [acción] PARA [objetivo]" y toda la información relevante y ejemplos si es posible

2. **Configurar el Entorno de Desarrollo**
   - Haz un fork del repositorio
   - Clónalo en tu máquina local
   - Crea una nueva rama para tu feature: `git checkout -b feature/nombre-de-tu-feature`
   - Configura las variables de entorno necesarias

3. **Desarrollo**
   - Sigue las guías de estilo del proyecto
   - Escribe pruebas unitarias para nuevas funcionalidades
   - Mantén los commits atómicos y descriptivos

4. **Pull Request**
   - Crea un PR desde tu fork hacia la rama principal
   - Incluye una descripción detallada de los cambios
   - Vincula el PR con el issue correspondiente
   - Asegúrate de que todas las pruebas pasen

5. **Revisión y Merge**
   - Tu PR será revisado por los mantenedores
   - Responde a los comentarios y realiza los cambios necesarios
   - Una vez aprobado, tu código será mergeado en la rama principal

### 3. Guías de Estilo

- Usa TypeScript para todo el código nuevo
- Sigue las convenciones de Vue 3 Composition API
- Mantén los componentes pequeños y reutilizables
- Documenta las funciones y componentes complejos
- Usa ESLint y Prettier para mantener la consistencia del código

### 4. Soporte

Si necesitas ayuda o tienes dudas:
- Revisa la documentación existente
- Abre un issue para discutir tu propuesta
- Contacta a los mantenedores del proyecto

## 📝 Licencia

Este proyecto está licenciado bajo la Licencia Pública General de GNU v3.0 (GPLv3) - ver el archivo [LICENSE](LICENSE) para más detalles.

La GPLv3 es una licencia de software libre que garantiza a los usuarios la libertad de:
- Usar el software para cualquier propósito
- Estudiar cómo funciona el software
- Modificar el software
- Distribuir el software
- Mejorar el software y compartir las mejoras

Para más información sobre la GPLv3, visita: https://www.gnu.org/licenses/gpl-3.0.html

## 👥 Mantenedores

- **Raúl Bejarano** - Desarrollador Principal
  - GitHub: [@RaulBejarano](https://github.com/RaulBejarano)
  - Responsable de:
    - Arquitectura del proyecto
    - Revisión de Pull Requests
    - Mantenimiento general
    - Coordinación del equipo
