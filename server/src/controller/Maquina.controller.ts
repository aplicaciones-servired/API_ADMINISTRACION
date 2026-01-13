import { Request, Response } from 'express';
import { sequelizeAdmin } from '../connection/db_administracion';

export class MaquinaController {
  
  /**
   * Crear nueva máquina
   * POST /api/maquinas
   * Body: { codigo, nombre, estado, fechaCompra?, fechaInicioOperacion?, ubicacion?, observaciones? }
   */
  static async crearMaquina(req: Request, res: Response) {
    try {
      const { 
        codigo, 
        nombre, 
        estado, 
        fechaCompra, 
        fechaInicioOperacion, 
        ubicacion, 
        observaciones 
      } = req.body;

      // Validaciones
      if (!codigo || !nombre || !estado) {
        return res.status(400).json({ 
          error: 'Faltan campos requeridos: codigo, nombre, estado' 
        });
      }

      if (!['ACTIVA', 'INACTIVA', 'MANTENIMIENTO'].includes(estado)) {
        return res.status(400).json({ 
          error: 'estado debe ser ACTIVA, INACTIVA o MANTENIMIENTO' 
        });
      }

      const query = `
        INSERT INTO MD_MAQUINA 
        (CODIGO, NOMBRE, ESTADO, FECHA_COMPRA, FECHA_INICIO_OPERACION, UBICACION, OBSERVACIONES)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const [result]: any = await sequelizeAdmin.query(query, {
        replacements: [
          codigo,
          nombre,
          estado,
          fechaCompra || null,
          fechaInicioOperacion || null,
          ubicacion || null,
          observaciones || null
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Máquina creada exitosamente',
        data: {
          idMaquina: result,
          codigo,
          nombre,
          estado
        }
      });

    } catch (error: any) {
      console.error('Error al crear máquina:', error);
      
      if (error.original?.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ 
          error: 'El código de la máquina ya existe' 
        });
      }
      
      res.status(500).json({ 
        error: 'Error al crear máquina',
        detalle: error.message 
      });
    }
  }

  /**
   * Obtener todas las máquinas
   * GET /api/maquinas?estado=ACTIVA
   */
  static async obtenerMaquinas(req: Request, res: Response) {
    try {
      const { estado } = req.query;

      let query = `
        SELECT 
          ID_MAQUINA,
          CODIGO,
          NOMBRE,
          ESTADO,
          FECHA_COMPRA,
          FECHA_INICIO_OPERACION,
          UBICACION,
          OBSERVACIONES,
          FECHA_CREACION
        FROM MD_MAQUINA
        WHERE 1=1
      `;

      const replacements: any[] = [];

      if (estado) {
        query += ' AND ESTADO = ?';
        replacements.push(String(estado).toUpperCase());
      }

      query += ' ORDER BY NOMBRE ASC';

      const [maquinas] = await sequelizeAdmin.query(query, { replacements });

      res.json({
        success: true,
        total: (maquinas as any[]).length,
        data: maquinas
      });

    } catch (error: any) {
      console.error('Error al obtener máquinas:', error);
      res.status(500).json({ 
        error: 'Error al obtener máquinas',
        detalle: error.message 
      });
    }
  }

  /**
   * Obtener máquina por ID
   * GET /api/maquinas/:id
   */
  static async obtenerMaquinaPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const query = `
        SELECT 
          ID_MAQUINA,
          CODIGO,
          NOMBRE,
          ESTADO,
          FECHA_COMPRA,
          FECHA_INICIO_OPERACION,
          UBICACION,
          OBSERVACIONES,
          FECHA_CREACION
        FROM MD_MAQUINA
        WHERE ID_MAQUINA = ?
      `;

      const [maquinas]: any = await sequelizeAdmin.query(query, {
        replacements: [id]
      });

      if (maquinas.length === 0) {
        return res.status(404).json({ error: 'Máquina no encontrada' });
      }

      res.json({
        success: true,
        data: maquinas[0]
      });

    } catch (error: any) {
      console.error('Error al obtener máquina:', error);
      res.status(500).json({ 
        error: 'Error al obtener máquina',
        detalle: error.message 
      });
    }
  }

  /**
   * Actualizar máquina
   * PUT /api/maquinas/:id
   * Body: { codigo?, nombre?, estado?, fechaCompra?, fechaInicioOperacion?, ubicacion?, observaciones? }
   */
  static async actualizarMaquina(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { 
        codigo, 
        nombre, 
        estado, 
        fechaCompra, 
        fechaInicioOperacion, 
        ubicacion, 
        observaciones 
      } = req.body;

      // Verificar que la máquina existe
      const [maquinaExiste]: any = await sequelizeAdmin.query(
        'SELECT ID_MAQUINA FROM MD_MAQUINA WHERE ID_MAQUINA = ?',
        { replacements: [id] }
      );

      if (maquinaExiste.length === 0) {
        return res.status(404).json({ error: 'Máquina no encontrada' });
      }

      // Construir query dinámico
      const campos: string[] = [];
      const valores: any[] = [];

      if (codigo !== undefined) {
        campos.push('CODIGO = ?');
        valores.push(codigo);
      }
      if (nombre !== undefined) {
        campos.push('NOMBRE = ?');
        valores.push(nombre);
      }
      if (estado !== undefined) {
        if (!['ACTIVA', 'INACTIVA', 'MANTENIMIENTO'].includes(estado)) {
          return res.status(400).json({ 
            error: 'estado debe ser ACTIVA, INACTIVA o MANTENIMIENTO' 
          });
        }
        campos.push('ESTADO = ?');
        valores.push(estado);
      }
      if (fechaCompra !== undefined) {
        campos.push('FECHA_COMPRA = ?');
        valores.push(fechaCompra);
      }
      if (fechaInicioOperacion !== undefined) {
        campos.push('FECHA_INICIO_OPERACION = ?');
        valores.push(fechaInicioOperacion);
      }
      if (ubicacion !== undefined) {
        campos.push('UBICACION = ?');
        valores.push(ubicacion);
      }
      if (observaciones !== undefined) {
        campos.push('OBSERVACIONES = ?');
        valores.push(observaciones);
      }

      if (campos.length === 0) {
        return res.status(400).json({ 
          error: 'No se proporcionaron campos para actualizar' 
        });
      }

      valores.push(id);

      const query = `
        UPDATE MD_MAQUINA 
        SET ${campos.join(', ')}
        WHERE ID_MAQUINA = ?
      `;

      await sequelizeAdmin.query(query, { replacements: valores });

      res.json({
        success: true,
        message: 'Máquina actualizada exitosamente'
      });

    } catch (error: any) {
      console.error('Error al actualizar máquina:', error);
      
      if (error.original?.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ 
          error: 'El código de la máquina ya existe' 
        });
      }
      
      res.status(500).json({ 
        error: 'Error al actualizar máquina',
        detalle: error.message 
      });
    }
  }

  /**
   * Cambiar estado de máquina
   * PATCH /api/maquinas/:id/estado
   * Body: { estado: 'ACTIVA' | 'INACTIVA' | 'MANTENIMIENTO' }
   */
  static async cambiarEstadoMaquina(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      if (!estado || !['ACTIVA', 'INACTIVA', 'MANTENIMIENTO'].includes(estado)) {
        return res.status(400).json({ 
          error: 'estado debe ser ACTIVA, INACTIVA o MANTENIMIENTO' 
        });
      }

      const [result]: any = await sequelizeAdmin.query(
        'UPDATE MD_MAQUINA SET ESTADO = ? WHERE ID_MAQUINA = ?',
        { replacements: [estado, id] }
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Máquina no encontrada' });
      }

      res.json({
        success: true,
        message: `Estado de máquina cambiado a ${estado}`
      });

    } catch (error: any) {
      console.error('Error al cambiar estado:', error);
      res.status(500).json({ 
        error: 'Error al cambiar estado',
        detalle: error.message 
      });
    }
  }

  /**
   * Eliminar máquina
   * DELETE /api/maquinas/:id
   */
  static async eliminarMaquina(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verificar que la máquina existe
      const [maquinaExiste]: any = await sequelizeAdmin.query(
        'SELECT ID_MAQUINA FROM MD_MAQUINA WHERE ID_MAQUINA = ?',
        { replacements: [id] }
      );

      if (maquinaExiste.length === 0) {
        return res.status(404).json({ error: 'Máquina no encontrada' });
      }

      // Cambiar a estado INACTIVA (soft delete)
      await sequelizeAdmin.query(
        'UPDATE MD_MAQUINA SET ESTADO = ? WHERE ID_MAQUINA = ?',
        { replacements: ['INACTIVA', id] }
      );

      res.json({
        success: true,
        message: 'Máquina desactivada exitosamente'
      });

    } catch (error: any) {
      console.error('Error al eliminar máquina:', error);
      res.status(500).json({ 
        error: 'Error al eliminar máquina',
        detalle: error.message 
      });
    }
  }

  /**
   * Buscar máquinas por nombre o código
   * GET /api/maquinas/buscar?q=maquina1
   */
  static async buscarMaquinas(req: Request, res: Response) {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({ 
          error: 'Se requiere el parámetro de búsqueda "q"' 
        });
      }

      const query = `
        SELECT 
          ID_MAQUINA,
          CODIGO,
          NOMBRE,
          ESTADO,
          FECHA_COMPRA,
          FECHA_INICIO_OPERACION,
          UBICACION,
          OBSERVACIONES,
          FECHA_CREACION
        FROM MD_MAQUINA
        WHERE (NOMBRE LIKE ? OR CODIGO LIKE ?)
        ORDER BY NOMBRE ASC
        LIMIT 50
      `;

      const searchTerm = `%${q}%`;
      const [maquinas] = await sequelizeAdmin.query(query, {
        replacements: [searchTerm, searchTerm]
      });

      res.json({
        success: true,
        total: (maquinas as any[]).length,
        data: maquinas
      });

    } catch (error: any) {
      console.error('Error al buscar máquinas:', error);
      res.status(500).json({ 
        error: 'Error al buscar máquinas',
        detalle: error.message 
      });
    }
  }
}
