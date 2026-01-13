import { Router, Request } from 'express';
import multer from 'multer';
import { ImagenesController } from '../controller/Imagenes.controller';

const ImagenesRouter = Router();

// Configurar multer para manejar archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB máximo
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    // Aceptar solo imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  }
});

// Rutas
ImagenesRouter.post('/upload', upload.single('imagen'), ImagenesController.uploadImagen);

// Rutas con tipoEntidad/idEntidad deben ir antes que las de :id para evitar conflictos
ImagenesRouter.get('/entidad/:tipoEntidad/:idEntidad', ImagenesController.getImagenesPorEntidad);
ImagenesRouter.delete('/entidad/:tipoEntidad/:idEntidad', ImagenesController.deleteImagenesPorEntidad);

// Rutas con :id van al final
ImagenesRouter.get('/:id', ImagenesController.getImagenPorId);
ImagenesRouter.delete('/:id', ImagenesController.deleteImagen);

export default ImagenesRouter;
