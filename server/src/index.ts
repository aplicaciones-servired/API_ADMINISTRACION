import { PORT } from './config';
import express from 'express';
import log from 'morgan';
import cors from 'cors';
import ImagenesRouter from './routes/imagenes.routes';
import ProductosRouter from './routes/productos.routes';
import MaquinaRouter from './routes/maquina.routes';
import InventarioRouter from './routes/inventario.routes';

const app = express();

// Middleware para logging detallado
app.use((req, res, next) => {
  console.log(`📨 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  next();
});

app.use(express.json());
app.use(cors());
app.use(log('dev'));

// Rutas
app.use('/api/imagenes', ImagenesRouter);
app.use('/api/productos', ProductosRouter);
app.use('/api/maquinas', MaquinaRouter);
app.use('/api/inventario', InventarioRouter);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API Administración - Sistema Completo',
    version: '1.0.0',
    endpoints: {
      imagenes: {
        upload: 'POST /api/imagenes/upload',
        getByEntity: 'GET /api/imagenes/:tipoEntidad/:idEntidad',
        getById: 'GET /api/imagenes/:id',
        delete: 'DELETE /api/imagenes/:id'
      },
      productos: {
        crear: 'POST /api/productos',
        listar: 'GET /api/productos',
        buscar: 'GET /api/productos/buscar?q=texto',
        obtener: 'GET /api/productos/:id',
        actualizar: 'PUT /api/productos/:id',
        eliminar: 'DELETE /api/productos/:id'
      },
      maquinas: {
        crear: 'POST /api/maquinas',
        listar: 'GET /api/maquinas',
        buscar: 'GET /api/maquinas/buscar?q=texto',
        obtener: 'GET /api/maquinas/:id',
        actualizar: 'PUT /api/maquinas/:id',
        cambiarEstado: 'PATCH /api/maquinas/:id/estado',
        eliminar: 'DELETE /api/maquinas/:id'
      },
      inventario: {
        crear: 'POST /api/inventario',
        listar: 'GET /api/inventario',
        detallado: 'GET /api/inventario/detallado',
        resumen: 'GET /api/inventario/resumen/productos',
        obtener: 'GET /api/inventario/:id',
        actualizar: 'PUT /api/inventario/:id',
        ajustar: 'PATCH /api/inventario/:id/ajustar',
        eliminar: 'DELETE /api/inventario/:id'
      }
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📱 Accesible desde red local en http://10.98.98.104:${PORT}`);
  console.log(`📦 MinIO: ${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`);
});
