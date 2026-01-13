import { Router } from 'express';
import { MaquinaController } from '../controller/Maquina.controller';

const router = Router();

// Rutas de máquinas
router.post('/', MaquinaController.crearMaquina);
router.get('/', MaquinaController.obtenerMaquinas);
router.get('/buscar', MaquinaController.buscarMaquinas);
router.get('/:id', MaquinaController.obtenerMaquinaPorId);
router.put('/:id', MaquinaController.actualizarMaquina);
router.patch('/:id/estado', MaquinaController.cambiarEstadoMaquina);
router.delete('/:id', MaquinaController.eliminarMaquina);

export default router;
