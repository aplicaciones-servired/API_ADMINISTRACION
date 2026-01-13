import { Router } from 'express';
import { ProductosController } from '../controller/Productos.controller';

const router = Router();

// Rutas de productos
router.post('/', ProductosController.crearProducto);
router.get('/', ProductosController.obtenerProductos);
router.get('/buscar', ProductosController.buscarProductos);
router.get('/:id', ProductosController.obtenerProductoPorId);
router.put('/:id', ProductosController.actualizarProducto);
router.delete('/:id', ProductosController.eliminarProducto);

export default router;
