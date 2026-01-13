# API Administración - Documentación

## Configuración Base
- **URL Base**: `http://localhost:3000`
- **Content-Type**: `application/json` (excepto upload de imágenes)

---

## 📦 PRODUCTOS

### 1. Crear Producto
```http
POST /api/productos
Content-Type: application/json

{
  "codigo": "PROD001",
  "nombre": "Arroz Premium",
  "tipoProducto": "ALIMENTO",
  "manejaVencimiento": true,
  "estado": true
}
```

**Respuesta Exitosa (201)**:
```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": {
    "idProducto": 1,
    "codigo": "PROD001",
    "nombre": "Arroz Premium",
    "tipoProducto": "ALIMENTO"
  }
}
```

### 2. Listar Productos
```http
GET /api/productos
GET /api/productos?estado=1
GET /api/productos?tipo=ALIMENTO
GET /api/productos?estado=1&tipo=TANGIBLE
```

### 3. Buscar Productos
```http
GET /api/productos/buscar?q=arroz
```

### 4. Obtener Producto por ID
```http
GET /api/productos/1
```

### 5. Actualizar Producto
```http
PUT /api/productos/1
Content-Type: application/json

{
  "nombre": "Arroz Premium Gold",
  "estado": true
}
```

### 6. Eliminar Producto (Soft Delete)
```http
DELETE /api/productos/1
```

---

## 🏭 MÁQUINAS

### 1. Crear Máquina
```http
POST /api/maquinas
Content-Type: application/json

{
  "codigo": "MAQ001",
  "nombre": "Empacadora Industrial",
  "estado": "ACTIVA",
  "fechaCompra": "2024-01-15",
  "fechaInicioOperacion": "2024-01-20",
  "ubicacion": "Planta Principal - Zona A",
  "observaciones": "Capacidad: 500kg/hora"
}
```

**Respuesta Exitosa (201)**:
```json
{
  "success": true,
  "message": "Máquina creada exitosamente",
  "data": {
    "idMaquina": 1,
    "codigo": "MAQ001",
    "nombre": "Empacadora Industrial",
    "estado": "ACTIVA"
  }
}
```

### 2. Listar Máquinas
```http
GET /api/maquinas
GET /api/maquinas?estado=ACTIVA
GET /api/maquinas?estado=MANTENIMIENTO
```

### 3. Buscar Máquinas
```http
GET /api/maquinas/buscar?q=empacadora
```

### 4. Obtener Máquina por ID
```http
GET /api/maquinas/1
```

### 5. Actualizar Máquina
```http
PUT /api/maquinas/1
Content-Type: application/json

{
  "ubicacion": "Planta Principal - Zona B",
  "observaciones": "Reubicada por mantenimiento"
}
```

### 6. Cambiar Estado de Máquina
```http
PATCH /api/maquinas/1/estado
Content-Type: application/json

{
  "estado": "MANTENIMIENTO"
}
```
**Estados válidos**: `ACTIVA`, `INACTIVA`, `MANTENIMIENTO`

### 7. Eliminar Máquina (Soft Delete)
```http
DELETE /api/maquinas/1
```

---

## 📊 INVENTARIO

### 1. Crear Registro de Inventario
```http
POST /api/inventario
Content-Type: application/json

{
  "idProducto": 1,
  "idLote": 100,
  "idUbicacion": 5,
  "cantidadActual": 500
}
```

**Respuesta Exitosa (201)**:
```json
{
  "success": true,
  "message": "Inventario creado exitosamente",
  "data": {
    "idInventario": 1,
    "idProducto": 1,
    "idLote": 100,
    "idUbicacion": 5,
    "cantidadActual": 500
  }
}
```

### 2. Listar Inventario
```http
GET /api/inventario
GET /api/inventario?idProducto=1
GET /api/inventario?idUbicacion=5
GET /api/inventario?idProducto=1&idUbicacion=5
```

### 3. Inventario Detallado (con nombres de productos)
```http
GET /api/inventario/detallado
GET /api/inventario/detallado?idProducto=1
```

### 4. Resumen por Producto
```http
GET /api/inventario/resumen/productos
```

**Respuesta**:
```json
{
  "success": true,
  "total": 3,
  "data": [
    {
      "ID_PRODUCTO": 1,
      "CODIGO": "PROD001",
      "NOMBRE": "Arroz Premium",
      "TIPO_PRODUCTO": "ALIMENTO",
      "CANTIDAD_TOTAL": 1500,
      "TOTAL_REGISTROS": 3
    }
  ]
}
```

### 5. Obtener Inventario por ID
```http
GET /api/inventario/1
```

### 6. Actualizar Inventario
```http
PUT /api/inventario/1
Content-Type: application/json

{
  "cantidadActual": 450,
  "idUbicacion": 6
}
```

### 7. Ajustar Inventario (Entrada/Salida)
```http
PATCH /api/inventario/1/ajustar
Content-Type: application/json

{
  "cantidad": 100,
  "tipo": "ENTRADA"
}
```

**Tipos válidos**: `ENTRADA`, `SALIDA`

**Respuesta**:
```json
{
  "success": true,
  "message": "ENTRADA registrada exitosamente",
  "data": {
    "cantidadAnterior": 450,
    "cantidadAjustada": 100,
    "cantidadNueva": 550
  }
}
```

### 8. Eliminar Registro de Inventario
```http
DELETE /api/inventario/1
```

---

## 🖼️ IMÁGENES

### 1. Subir Imagen
```http
POST /api/imagenes/upload
Content-Type: multipart/form-data

FormData:
- imagen: [archivo]
- tipoEntidad: "INVENTARIO" | "ARQUEO"
- idEntidad: 1
- loginRegistro: "usuario123"
```

**Ejemplo con cURL**:
```bash
curl -X POST http://localhost:3000/api/imagenes/upload \
  -F "imagen=@/path/to/image.jpg" \
  -F "tipoEntidad=INVENTARIO" \
  -F "idEntidad=1" \
  -F "loginRegistro=usuario123"
```

**Respuesta Exitosa (201)**:
```json
{
  "success": true,
  "message": "Imagen subida exitosamente",
  "data": {
    "idImagen": 1,
    "url": "http://10.98.98.116:9000/inventario-imagenes/inventario/1736778123456-uuid.jpg",
    "rutaImagen": "inventario/1736778123456-uuid.jpg",
    "nombreArchivo": "imagen.jpg",
    "tamano": 245678
  }
}
```

### 2. Obtener Imágenes por Entidad
```http
GET /api/imagenes/INVENTARIO/1
GET /api/imagenes/ARQUEO/5
```

**Respuesta**:
```json
{
  "success": true,
  "total": 2,
  "data": [
    {
      "ID_IMAGEN": 1,
      "TIPO_ENTIDAD": "INVENTARIO",
      "ID_ENTIDAD": 1,
      "RUTA_IMAGEN": "inventario/1736778123456-uuid.jpg",
      "NOMBRE_ARCHIVO": "imagen1.jpg",
      "TIPO_ARCHIVO": "image/jpeg",
      "TAMANO_BYTES": 245678,
      "FECHA_CARGA": "2026-01-13T10:30:00.000Z",
      "LOGINREGISTRO": "usuario123",
      "url": "http://10.98.98.116:9000/inventario-imagenes/inventario/1736778123456-uuid.jpg"
    }
  ]
}
```

### 3. Obtener Imagen por ID
```http
GET /api/imagenes/1
```

### 4. Eliminar Imagen
```http
DELETE /api/imagenes/1
```

### 5. Eliminar Todas las Imágenes de una Entidad
```http
DELETE /api/imagenes/INVENTARIO/1
```

---

## 📋 Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Operación exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Conflicto (ej: código duplicado) |
| 500 | Internal Server Error - Error del servidor |

---

## 🔍 Ejemplos de Flujo Completo

### Crear Producto con Imagen
```javascript
// 1. Crear el producto
const producto = await fetch('http://localhost:3000/api/productos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    codigo: 'PROD001',
    nombre: 'Arroz Premium',
    tipoProducto: 'ALIMENTO'
  })
});

const { data } = await producto.json();
const idProducto = data.idProducto;

// 2. Crear inventario
await fetch('http://localhost:3000/api/inventario', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    idProducto: idProducto,
    idLote: 100,
    idUbicacion: 5,
    cantidadActual: 500
  })
});

// 3. Subir imagen del inventario
const formData = new FormData();
formData.append('imagen', archivoImagen);
formData.append('tipoEntidad', 'INVENTARIO');
formData.append('idEntidad', idProducto);
formData.append('loginRegistro', 'usuario123');

await fetch('http://localhost:3000/api/imagenes/upload', {
  method: 'POST',
  body: formData
});
```

### Ajustar Inventario (Entrada/Salida)
```javascript
// Registrar entrada de mercancía
await fetch('http://localhost:3000/api/inventario/1/ajustar', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cantidad: 200,
    tipo: 'ENTRADA'
  })
});

// Registrar salida de mercancía
await fetch('http://localhost:3000/api/inventario/1/ajustar', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cantidad: 50,
    tipo: 'SALIDA'
  })
});
```

---

## 🚀 Iniciar el Servidor

```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`
