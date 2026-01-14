import { Request, Response } from 'express';
import { sequelizeAdmin } from '../connection/db_administracion';

export class InventarioController {
  
  /**
   * Crear registro de inventario
   * POST /api/inventario
   * Body: { idProducto, idLote, idUbicacion, cantidadActual }
   */
  static async crearInventario(req: Request, res: Response) {
    console.log('\n🔵 === CREAR INVENTARIO - INICIO ===');
    console.log('📥 Body recibido:', JSON.stringify(req.body, null, 2));
    console.log('📋 Headers:', JSON.stringify(req.headers, null, 2));
    
    try {
      const { idProducto, idLote, idUbicacion, cantidadActual } = req.body;

      console.log('✅ Datos extraídos:', { idProducto, idLote, idUbicacion, cantidadActual });

      // Validaciones
      if (!idProducto || !idLote || !idUbicacion || cantidadActual === undefined) {
        console.error('❌ Faltan campos requeridos');
        return res.status(400).json({ 
          error: 'Faltan campos requeridos: idProducto, idLote, idUbicacion, cantidadActual' 
        });
      }

      if (cantidadActual < 0) {
        return res.status(400).json({ 
          error: 'La cantidad actual no puede ser negativa' 
        });
      }

      console.log('🔄 Preparando query INSERT...');
      const query = `
        INSERT INTO MD_INVENTARIO 
        (ID_PRODUCTO, ID_LOTE, ID_UBICACION, CANTIDAD_ACTUAL)
        VALUES (?, ?, ?, ?)
      `;

      console.log('⏳ Ejecutando query en base de datos...');
      const [result]: any = await sequelizeAdmin.query(query, {
        replacements: [idProducto, idLote, idUbicacion, cantidadActual]
      });

      console.log('✅ Query ejecutado exitosamente. Result:', result);

      res.status(201).json({
        success: true,
        message: 'Inventario creado exitosamente',
        data: {
          idInventario: result,
          idProducto,
          idLote,
          idUbicacion,
          cantidadActual
        }
      });

    } catch (error: any) {
      console.error('\n❌ === ERROR AL CREAR INVENTARIO ===');
      console.error('Tipo:', error.constructor.name);
      console.error('Mensaje:', error.message);
      console.error('Stack:', error.stack);
      console.error('=================================\n');
      
      res.status(500).json({ 
        error: 'Error al crear inventario',
        detalle: error.message,
        tipo: error.constructor.name
      });
    }
  }

  /**
   * Obtener todo el inventario
   * GET /api/inventario?idProducto=1&idUbicacion=5
   */
  static async obtenerInventario(req: Request, res: Response) {
    try {
      const { idProducto, idUbicacion, idLote } = req.query;

      let query = `
        SELECT 
          i.ID_INVENTARIO,
          i.ID_PRODUCTO,
          i.ID_LOTE,
          i.ID_UBICACION,
          i.CANTIDAD_ACTUAL,
          i.FECHA_ACTUALIZACION
        FROM MD_INVENTARIO i
        WHERE 1=1
      `;

      const replacements: any[] = [];

      if (idProducto) {
        query += ' AND i.ID_PRODUCTO = ?';
        replacements.push(idProducto);
      }

      if (idUbicacion) {
        query += ' AND i.ID_UBICACION = ?';
        replacements.push(idUbicacion);
      }

      if (idLote) {
        query += ' AND i.ID_LOTE = ?';
        replacements.push(idLote);
      }

      query += ' ORDER BY i.FECHA_ACTUALIZACION DESC';

      const [inventario] = await sequelizeAdmin.query(query, { replacements });

      res.json({
        success: true,
        total: (inventario as any[]).length,
        data: inventario
      });

    } catch (error: any) {
      console.error('Error al obtener inventario:', error);
      res.status(500).json({ 
        error: 'Error al obtener inventario',
        detalle: error.message 
      });
    }
  }

  /**
   * Obtener inventario detallado con nombres de productos
   * GET /api/inventario/detallado
   */
  static async obtenerInventarioDetallado(req: Request, res: Response) {
    try {
      const { idProducto, idUbicacion } = req.query;

      let query = `
        SELECT 
          i.ID_INVENTARIO,
          i.ID_PRODUCTO,
          p.CODIGO as CODIGO_PRODUCTO,
          p.NOMBRE as NOMBRE_PRODUCTO,
          p.TIPO_PRODUCTO,
          i.ID_LOTE,
          i.ID_UBICACION,
          i.CANTIDAD_ACTUAL,
          i.FECHA_ACTUALIZACION
        FROM MD_INVENTARIO i
        INNER JOIN MD_PRODUCTOS p ON i.ID_PRODUCTO = p.ID_PRODUCTO
        WHERE 1=1
      `;

      const replacements: any[] = [];

      if (idProducto) {
        query += ' AND i.ID_PRODUCTO = ?';
        replacements.push(idProducto);
      }

      if (idUbicacion) {
        query += ' AND i.ID_UBICACION = ?';
        replacements.push(idUbicacion);
      }

      query += ' ORDER BY i.FECHA_ACTUALIZACION DESC';

      const [inventario] = await sequelizeAdmin.query(query, { replacements });

      res.json({
        success: true,
        total: (inventario as any[]).length,
        data: inventario
      });

    } catch (error: any) {
      console.error('Error al obtener inventario detallado:', error);
      res.status(500).json({ 
        error: 'Error al obtener inventario detallado',
        detalle: error.message 
      });
    }
  }

  /**
   * Obtener inventario por ID
   * GET /api/inventario/:id
   */
  static async obtenerInventarioPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const query = `
        SELECT 
          i.ID_INVENTARIO,
          i.ID_PRODUCTO,
          p.CODIGO as CODIGO_PRODUCTO,
          p.NOMBRE as NOMBRE_PRODUCTO,
          i.ID_LOTE,
          i.ID_UBICACION,
          i.CANTIDAD_ACTUAL,
          i.FECHA_ACTUALIZACION
        FROM MD_INVENTARIO i
        INNER JOIN MD_PRODUCTOS p ON i.ID_PRODUCTO = p.ID_PRODUCTO
        WHERE i.ID_INVENTARIO = ?
      `;

      const [inventario]: any = await sequelizeAdmin.query(query, {
        replacements: [id]
      });

      if (inventario.length === 0) {
        return res.status(404).json({ error: 'Registro de inventario no encontrado' });
      }

      res.json({
        success: true,
        data: inventario[0]
      });

    } catch (error: any) {
      console.error('Error al obtener inventario:', error);
      res.status(500).json({ 
        error: 'Error al obtener inventario',
        detalle: error.message 
      });
    }
  }

  /**
   * Actualizar cantidad de inventario
   * PUT /api/inventario/:id
   * Body: { cantidadActual?, idLote?, idUbicacion? }
   */
  static async actualizarInventario(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { cantidadActual, idLote, idUbicacion } = req.body;

      // Verificar que el inventario existe
      const [inventarioExiste]: any = await sequelizeAdmin.query(
        'SELECT ID_INVENTARIO FROM MD_INVENTARIO WHERE ID_INVENTARIO = ?',
        { replacements: [id] }
      );

      if (inventarioExiste.length === 0) {
        return res.status(404).json({ error: 'Registro de inventario no encontrado' });
      }

      // Construir query dinámico
      const campos: string[] = [];
      const valores: any[] = [];

      if (cantidadActual !== undefined) {
        if (cantidadActual < 0) {
          return res.status(400).json({ 
            error: 'La cantidad actual no puede ser negativa' 
          });
        }
        campos.push('CANTIDAD_ACTUAL = ?');
        valores.push(cantidadActual);
      }

      if (idLote !== undefined) {
        campos.push('ID_LOTE = ?');
        valores.push(idLote);
      }

      if (idUbicacion !== undefined) {
        campos.push('ID_UBICACION = ?');
        valores.push(idUbicacion);
      }

      if (campos.length === 0) {
        return res.status(400).json({ 
          error: 'No se proporcionaron campos para actualizar' 
        });
      }

      // Actualizar fecha de actualización
      campos.push('FECHA_ACTUALIZACION = CURRENT_TIMESTAMP');
      valores.push(id);

      const query = `
        UPDATE MD_INVENTARIO 
        SET ${campos.join(', ')}
        WHERE ID_INVENTARIO = ?
      `;

      await sequelizeAdmin.query(query, { replacements: valores });

      res.json({
        success: true,
        message: 'Inventario actualizado exitosamente'
      });

    } catch (error: any) {
      console.error('Error al actualizar inventario:', error);
      res.status(500).json({ 
        error: 'Error al actualizar inventario',
        detalle: error.message 
      });
    }
  }

  /**
   * Ajustar cantidad de inventario (sumar o restar)
   * PATCH /api/inventario/:id/ajustar
   * Body: { cantidad: number, tipo: 'ENTRADA' | 'SALIDA' }
   */
  static async ajustarInventario(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { cantidad, tipo } = req.body;

      if (!cantidad || !tipo) {
        return res.status(400).json({ 
          error: 'Faltan campos requeridos: cantidad, tipo' 
        });
      }

      if (!['ENTRADA', 'SALIDA'].includes(tipo)) {
        return res.status(400).json({ 
          error: 'tipo debe ser ENTRADA o SALIDA' 
        });
      }

      // Obtener cantidad actual
      const [inventario]: any = await sequelizeAdmin.query(
        'SELECT CANTIDAD_ACTUAL FROM MD_INVENTARIO WHERE ID_INVENTARIO = ?',
        { replacements: [id] }
      );

      if (inventario.length === 0) {
        return res.status(404).json({ error: 'Registro de inventario no encontrado' });
      }

      const cantidadActual = inventario[0].CANTIDAD_ACTUAL;
      let nuevaCantidad: number;

      if (tipo === 'ENTRADA') {
        nuevaCantidad = cantidadActual + Math.abs(cantidad);
      } else {
        nuevaCantidad = cantidadActual - Math.abs(cantidad);
        
        if (nuevaCantidad < 0) {
          return res.status(400).json({ 
            error: 'No hay suficiente inventario para realizar la salida',
            cantidadActual,
            cantidadSolicitada: cantidad
          });
        }
      }

      // Actualizar cantidad
      await sequelizeAdmin.query(
        'UPDATE MD_INVENTARIO SET CANTIDAD_ACTUAL = ?, FECHA_ACTUALIZACION = CURRENT_TIMESTAMP WHERE ID_INVENTARIO = ?',
        { replacements: [nuevaCantidad, id] }
      );

      res.json({
        success: true,
        message: `${tipo} registrada exitosamente`,
        data: {
          cantidadAnterior: cantidadActual,
          cantidadAjustada: cantidad,
          cantidadNueva: nuevaCantidad
        }
      });

    } catch (error: any) {
      console.error('Error al ajustar inventario:', error);
      res.status(500).json({ 
        error: 'Error al ajustar inventario',
        detalle: error.message 
      });
    }
  }

  /**
   * Eliminar registro de inventario
   * DELETE /api/inventario/:id
   */
  static async eliminarInventario(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const [result]: any = await sequelizeAdmin.query(
        'DELETE FROM MD_INVENTARIO WHERE ID_INVENTARIO = ?',
        { replacements: [id] }
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Registro de inventario no encontrado' });
      }

      res.json({
        success: true,
        message: 'Registro de inventario eliminado exitosamente'
      });

    } catch (error: any) {
      console.error('Error al eliminar inventario:', error);
      res.status(500).json({ 
        error: 'Error al eliminar inventario',
        detalle: error.message 
      });
    }
  }

  /**
   * Obtener resumen de inventario por producto
   * GET /api/inventario/resumen/productos
   */
  static async obtenerResumenPorProducto(req: Request, res: Response) {
    try {
      const query = `
        SELECT 
          p.ID_PRODUCTO,
          p.CODIGO,
          p.NOMBRE,
          p.TIPO_PRODUCTO,
          SUM(i.CANTIDAD_ACTUAL) as CANTIDAD_TOTAL,
          COUNT(i.ID_INVENTARIO) as TOTAL_REGISTROS
        FROM MD_PRODUCTOS p
        LEFT JOIN MD_INVENTARIO i ON p.ID_PRODUCTO = i.ID_PRODUCTO
        WHERE p.ESTADO = 1
        GROUP BY p.ID_PRODUCTO, p.CODIGO, p.NOMBRE, p.TIPO_PRODUCTO
        HAVING CANTIDAD_TOTAL > 0
        ORDER BY p.NOMBRE ASC
      `;

      const [resumen] = await sequelizeAdmin.query(query);

      res.json({
        success: true,
        total: (resumen as any[]).length,
        data: resumen
      });

    } catch (error: any) {
      console.error('Error al obtener resumen:', error);
      res.status(500).json({ 
        error: 'Error al obtener resumen',
        detalle: error.message 
      });
    }
  }
}
