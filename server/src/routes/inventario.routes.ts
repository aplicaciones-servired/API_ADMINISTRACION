import { Router } from 'express';
import { InventarioController } from '../controller/Inventario.controller';

const router = Router();

// Rutas de inventario
router.post('/', InventarioController.crearInventario);
router.get('/', InventarioController.obtenerInventario);
router.get('/detallado', InventarioController.obtenerInventarioDetallado);
router.get('/resumen/productos', InventarioController.obtenerResumenPorProducto);
router.get('/:id', InventarioController.obtenerInventarioPorId);
router.put('/:id', InventarioController.actualizarInventario);
router.patch('/:id/ajustar', InventarioController.ajustarInventario);
router.delete('/:id', InventarioController.eliminarInventario);

export default router;
