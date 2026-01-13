import { Request, Response } from 'express';
import { sequelizeAdmin } from '../connection/db_administracion';
import { minioClient, BUCKET_NAME } from '../connection/minio';
import { v4 as uuidv4 } from 'uuid';
import { Imagen, ImagenResponse } from '../models/Imagenes.model';

export class ImagenesController {
  
  /**
   * Subir imagen a MinIO y guardar metadata en MySQL
   * POST /api/imagenes/upload
   * Body (multipart/form-data):
   *   - imagen: archivo
   *   - tipoEntidad: 'INVENTARIO' | 'ARQUEO'
   *   - idEntidad: number
   *   - loginRegistro: string
   */
  static async uploadImagen(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
      }

      const { tipoEntidad, idEntidad, loginRegistro } = req.body;

      // Validaciones
      if (!tipoEntidad || !idEntidad) {
        return res.status(400).json({ error: 'Faltan campos requeridos: tipoEntidad, idEntidad' });
      }

      if (!['INVENTARIO', 'ARQUEO'].includes(tipoEntidad)) {
        return res.status(400).json({ error: 'tipoEntidad debe ser INVENTARIO o ARQUEO' });
      }

      const file = req.file;
      
      // Generar nombre único para el archivo
      const extension = file.originalname.split('.').pop();
      const fileName = `${tipoEntidad.toLowerCase()}/${Date.now()}-${uuidv4()}.${extension}`;

      // Subir a MinIO
      await minioClient.putObject(
        BUCKET_NAME,
        fileName,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
          'x-amz-meta-original-name': file.originalname
        }
      );

      // Guardar metadata en MySQL
      const query = `
        INSERT INTO MD_IMAGENES 
        (TIPO_ENTIDAD, ID_ENTIDAD, RUTA_IMAGEN, NOMBRE_ARCHIVO, TIPO_ARCHIVO, TAMANO_BYTES, LOGINREGISTRO)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const [result]: any = await sequelizeAdmin.query(query, {
        replacements: [
          tipoEntidad,
          idEntidad,
          fileName,
          file.originalname,
          file.mimetype,
          file.size,
          loginRegistro || 'sistema'
        ]
      });

      // URL pública de la imagen
      const imageUrl = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${BUCKET_NAME}/${fileName}`;

      res.status(201).json({
        success: true,
        message: 'Imagen subida exitosamente',
        data: {
          idImagen: result.insertId,
          url: imageUrl,
          rutaImagen: fileName,
          nombreArchivo: file.originalname,
          tamano: file.size
        }
      });

    } catch (error: any) {
      console.error('Error al subir imagen:', error);
      res.status(500).json({ 
        error: 'Error al subir imagen',
        detalle: error.message 
      });
    }
  }

  /**
   * Obtener todas las imágenes de una entidad
   * GET /api/imagenes/:tipoEntidad/:idEntidad
   */
  static async getImagenesPorEntidad(req: Request, res: Response) {
    try {
      const { tipoEntidad, idEntidad } = req.params;

      if (!['INVENTARIO', 'ARQUEO'].includes(String(tipoEntidad).toUpperCase())) {
        return res.status(400).json({ error: 'tipoEntidad inválido' });
      }

      const query = `
        SELECT 
          ID_IMAGEN,
          TIPO_ENTIDAD,
          ID_ENTIDAD,
          RUTA_IMAGEN,
          NOMBRE_ARCHIVO,
          TIPO_ARCHIVO,
          TAMANO_BYTES,
          FECHA_CARGA,
          LOGINREGISTRO
        FROM MD_IMAGENES
        WHERE TIPO_ENTIDAD = ? AND ID_ENTIDAD = ?
        ORDER BY FECHA_CARGA DESC
      `;

      const [imagenes]: any = await sequelizeAdmin.query(query, {
        replacements: [String(tipoEntidad).toUpperCase(), idEntidad]
      });

      // Agregar URLs públicas
      const imagenesConUrl = imagenes.map((img: Imagen) => ({
        ...img,
        url: `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${BUCKET_NAME}/${img.RUTA_IMAGEN}`
      }));

      res.json({
        success: true,
        total: imagenesConUrl.length,
        data: imagenesConUrl
      });

    } catch (error: any) {
      console.error('Error al obtener imágenes:', error);
      res.status(500).json({ 
        error: 'Error al obtener imágenes',
        detalle: error.message 
      });
    }
  }

  /**
   * Obtener imagen específica
   * GET /api/imagenes/:id
   */
  static async getImagenPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const query = `
        SELECT * FROM MD_IMAGENES WHERE ID_IMAGEN = ?
      `;

      const [imagenes]: any = await sequelizeAdmin.query(query, {
        replacements: [id]
      });

      if (imagenes.length === 0) {
        return res.status(404).json({ error: 'Imagen no encontrada' });
      }

      const imagen = imagenes[0];
      const imageUrl = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${BUCKET_NAME}/${imagen.RUTA_IMAGEN}`;

      res.json({
        success: true,
        data: {
          ...imagen,
          url: imageUrl
        }
      });

    } catch (error: any) {
      console.error('Error al obtener imagen:', error);
      res.status(500).json({ 
        error: 'Error al obtener imagen',
        detalle: error.message 
      });
    }
  }

  /**
   * Eliminar imagen
   * DELETE /api/imagenes/:id
   */
  static async deleteImagen(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Obtener info de la imagen
      const [imagenes]: any = await sequelizeAdmin.query(
        'SELECT RUTA_IMAGEN FROM MD_IMAGENES WHERE ID_IMAGEN = ?',
        { replacements: [id] }
      );

      if (imagenes.length === 0) {
        return res.status(404).json({ error: 'Imagen no encontrada' });
      }

      const rutaImagen = imagenes[0].RUTA_IMAGEN;

      // Eliminar de MinIO
      await minioClient.removeObject(BUCKET_NAME, rutaImagen);

      // Eliminar de MySQL
      await sequelizeAdmin.query('DELETE FROM MD_IMAGENES WHERE ID_IMAGEN = ?', {
        replacements: [id]
      });

      res.json({
        success: true,
        message: 'Imagen eliminada exitosamente'
      });

    } catch (error: any) {
      console.error('Error al eliminar imagen:', error);
      res.status(500).json({ 
        error: 'Error al eliminar imagen',
        detalle: error.message 
      });
    }
  }

  /**
   * Eliminar todas las imágenes de una entidad
   * DELETE /api/imagenes/:tipoEntidad/:idEntidad
   */
  static async deleteImagenesPorEntidad(req: Request, res: Response) {
    try {
      const { tipoEntidad, idEntidad } = req.params;

      // Obtener todas las imágenes de la entidad
      const [imagenes]: any = await sequelizeAdmin.query(
        'SELECT ID_IMAGEN, RUTA_IMAGEN FROM MD_IMAGENES WHERE TIPO_ENTIDAD = ? AND ID_ENTIDAD = ?',
        { replacements: [String(tipoEntidad).toUpperCase(), idEntidad] }
      );

      if (imagenes.length === 0) {
        return res.json({
          success: true,
          message: 'No hay imágenes para eliminar',
          eliminadas: 0
        });
      }

      // Eliminar de MinIO
      const rutasImagenes = imagenes.map((img: any) => img.RUTA_IMAGEN);
      await minioClient.removeObjects(BUCKET_NAME, rutasImagenes);

      // Eliminar de MySQL
      await sequelizeAdmin.query(
        'DELETE FROM MD_IMAGENES WHERE TIPO_ENTIDAD = ? AND ID_ENTIDAD = ?',
        { replacements: [String(tipoEntidad).toUpperCase(), idEntidad] }
      );

      res.json({
        success: true,
        message: `${imagenes.length} imagen(es) eliminada(s) exitosamente`,
        eliminadas: imagenes.length
      });

    } catch (error: any) {
      console.error('Error al eliminar imágenes:', error);
      res.status(500).json({ 
        error: 'Error al eliminar imágenes',
        detalle: error.message 
      });
    }
  }
}
