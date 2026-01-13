# API Administración

API REST para gestión de inventario, productos, máquinas e imágenes con almacenamiento en MinIO.

## 🚀 Tecnologías

- **Node.js v22** + TypeScript
- **Express.js** - Framework web
- **Sequelize** - ORM para MySQL
- **MinIO** - Almacenamiento de imágenes
- **Docker** + Docker Compose
- **Jenkins** - CI/CD
- **Nginx** - Reverse Proxy

## 📋 Requisitos

- Docker y Docker Compose
- Red Docker externa: `red-gane-int`
- Jenkins con Node.js v22 instalado
- Credenciales configuradas en Jenkins: `ENV_SERVER_ADMINISTRACION`

## 🛠️ Instalación Local

### 1. Clonar el repositorio
```bash
git clone <repo-url>
cd API_ADMINISTRACION
```

### 2. Configurar variables de entorno
```bash
cd server
cp .env.example .env
# Editar .env con tus configuraciones
```

### 3. Instalar dependencias
```bash
cd server
npm install
```

### 4. Desarrollo local
```bash
npm run dev  # Modo desarrollo con hot-reload
```

### 5. Compilar TypeScript
```bash
npm run build
```

### 6. Producción local
```bash
npm start
```

## 🐳 Despliegue con Docker

### Crear red externa (solo primera vez)
```bash
docker network create red-gane-int
```

### Levantar servicios
```bash
docker compose up -d --build
```

### Ver logs
```bash
docker compose logs -f api_administracion
```

### Detener servicios
```bash
docker compose down
```

## 🔄 CI/CD con Jenkins

El proyecto incluye un `Jenkinsfile` que automatiza:

1. ✅ Copia de archivos `.env` desde credenciales de Jenkins
2. ✅ Instalación de dependencias
3. ✅ Detener contenedores previos
4. ✅ Eliminar imágenes antiguas
5. ✅ Build y deploy con Docker Compose

### Configuración en Jenkins

1. Crear credencial `ENV_SERVER_ADMINISTRACION` tipo "Secret file"
2. Configurar Node.js v22 con el ID `node-v22`
3. Crear pipeline apuntando al `Jenkinsfile`

## 📡 Endpoints

La API está disponible en: `http://localhost:3001/api/`

### Productos
- `POST /api/productos` - Crear producto
- `GET /api/productos` - Listar productos
- `GET /api/productos/buscar?q=texto` - Buscar productos
- `GET /api/productos/:id` - Obtener producto
- `PUT /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Eliminar producto

### Máquinas
- `POST /api/maquinas` - Crear máquina
- `GET /api/maquinas` - Listar máquinas
- `GET /api/maquinas/buscar?q=texto` - Buscar máquinas
- `GET /api/maquinas/:id` - Obtener máquina
- `PUT /api/maquinas/:id` - Actualizar máquina
- `PATCH /api/maquinas/:id/estado` - Cambiar estado
- `DELETE /api/maquinas/:id` - Eliminar máquina

### Inventario
- `POST /api/inventario` - Crear registro
- `GET /api/inventario` - Listar inventario
- `GET /api/inventario/detallado` - Vista detallada
- `GET /api/inventario/resumen/productos` - Resumen por producto
- `GET /api/inventario/:id` - Obtener registro
- `PUT /api/inventario/:id` - Actualizar registro
- `PATCH /api/inventario/:id/ajustar` - Ajustar cantidad
- `DELETE /api/inventario/:id` - Eliminar registro

### Imágenes
- `POST /api/imagenes/upload` - Subir imagen (multipart/form-data)
- `GET /api/imagenes/entidad/:tipoEntidad/:idEntidad` - Imágenes por entidad
- `GET /api/imagenes/:id` - Obtener imagen por ID
- `DELETE /api/imagenes/:id` - Eliminar imagen
- `DELETE /api/imagenes/entidad/:tipoEntidad/:idEntidad` - Eliminar todas las imágenes de una entidad

### Health Check
- `GET /health` - Verificar estado del servidor

## 📁 Estructura del Proyecto

```
API_ADMINISTRACION/
├── server/
│   ├── src/
│   │   ├── config.ts
│   │   ├── index.ts
│   │   ├── connection/
│   │   │   ├── db_administracion.ts
│   │   │   └── minio.ts
│   │   ├── controller/
│   │   │   ├── Imagenes.controller.ts
│   │   │   ├── Inventario.controller.ts
│   │   │   ├── Maquina.controller.ts
│   │   │   └── Productos.controller.ts
│   │   ├── models/
│   │   │   ├── Imagenes.model.ts
│   │   │   ├── Inventario.model.ts
│   │   │   ├── Maquina.model.ts
│   │   │   └── Productos.model.ts
│   │   └── routes/
│   │       ├── imagenes.routes.ts
│   │       ├── inventario.routes.ts
│   │       ├── maquina.routes.ts
│   │       └── productos.routes.ts
│   ├── package.json
│   ├── Dockerfile
│   ├── .env.example
│   └── API_DOCUMENTATION.md
├── conf/
│   └── nginx.conf
├── docker-compose.yml
└── Jenkinsfile
```

## 🔒 Seguridad

- Las credenciales se gestionan via variables de entorno
- Archivo `.env` no está en el repositorio
- Jenkins maneja credenciales sensibles
- MinIO con autenticación configurada
- Nginx como proxy inverso

## 🧪 Testing

```bash
npm test  # Ejecutar tests (cuando estén configurados)
```

## 📝 Documentación Detallada

Ver [API_DOCUMENTATION.md](server/API_DOCUMENTATION.md) para ejemplos completos de uso de todos los endpoints.

## 🐛 Troubleshooting

### El contenedor no inicia
```bash
# Ver logs
docker compose logs -f api_administracion

# Verificar red
docker network ls | grep red-gane-int
```

### Error de conexión a base de datos
- Verificar que las variables `DB_*` en `.env` son correctas
- Verificar que el servidor MySQL es accesible
- Verificar usuario y contraseña

### Error de conexión a MinIO
- Verificar que MinIO está corriendo
- Verificar configuración `MINIO_*` en `.env`
- Verificar acceso de red al endpoint de MinIO

## 👥 Contribuir

1. Crear rama feature
2. Hacer cambios
3. Commit y push
4. Jenkins desplegará automáticamente

## 📄 Licencia

ISC
