import { Request, Response } from 'express';
import { sequelizeAdmin } from '../connection/db_administracion';

export class ProductosController {
  
  /**
   * Crear nuevo producto
   * POST /api/productos
   * Body: { codigo, nombre, tipoProducto, manejaVencimiento?, estado? }
   */
  static async crearProducto(req: Request, res: Response) {
    try {
      const { codigo, nombre, tipoProducto, manejaVencimiento, estado } = req.body;

      // Validaciones
      if (!codigo || !nombre || !tipoProducto) {
        return res.status(400).json({ 
          error: 'Faltan campos requeridos: codigo, nombre, tipoProducto' 
        });
      }

      if (!['ALIMENTO', 'TANGIBLE'].includes(tipoProducto)) {
        return res.status(400).json({ 
          error: 'tipoProducto debe ser ALIMENTO o TANGIBLE' 
        });
      }

      const query = `
        INSERT INTO MD_PRODUCTOS 
        (CODIGO, NOMBRE, TIPO_PRODUCTO, MANEJA_VENCIMIENTO, ESTADO)
        VALUES (?, ?, ?, ?, ?)
      `;

      const [result]: any = await sequelizeAdmin.query(query, {
        replacements: [
          codigo,
          nombre,
          tipoProducto,
          manejaVencimiento !== undefined ? manejaVencimiento : true,
          estado !== undefined ? estado : true
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: {
          idProducto: result,
          codigo,
          nombre,
          tipoProducto
        }
      });

    } catch (error: any) {
      console.error('Error al crear producto:', error);
      
      // Manejar error de código duplicado
      if (error.original?.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ 
          error: 'El código del producto ya existe' 
        });
      }
      
      res.status(500).json({ 
        error: 'Error al crear producto',
        detalle: error.message 
      });
    }
  }

  /**
   * Obtener todos los productos
   * GET /api/productos?estado=1&tipo=ALIMENTO
   */
  static async obtenerProductos(req: Request, res: Response) {
    try {
      const { estado, tipo } = req.query;

      let query = `
        SELECT 
          ID_PRODUCTO,
          CODIGO,
          NOMBRE,
          TIPO_PRODUCTO,
          MANEJA_VENCIMIENTO,
          ESTADO,
          FECHA_CREACION
        FROM MD_PRODUCTOS
        WHERE 1=1
      `;

      const replacements: any[] = [];

      if (estado !== undefined) {
        query += ' AND ESTADO = ?';
        replacements.push(estado === 'true' || estado === '1' ? 1 : 0);
      }

      if (tipo) {
        query += ' AND TIPO_PRODUCTO = ?';
        replacements.push(String(tipo).toUpperCase());
      }

      query += ' ORDER BY NOMBRE ASC';

      const [productos] = await sequelizeAdmin.query(query, { replacements });

      res.json({
        success: true,
        total: (productos as any[]).length,
        data: productos
      });

    } catch (error: any) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ 
        error: 'Error al obtener productos',
        detalle: error.message 
      });
    }
  }

  /**
   * Obtener producto por ID
   * GET /api/productos/:id
   */
  static async obtenerProductoPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const query = `
        SELECT 
          ID_PRODUCTO,
          CODIGO,
          NOMBRE,
          TIPO_PRODUCTO,
          MANEJA_VENCIMIENTO,
          ESTADO,
          FECHA_CREACION
        FROM MD_PRODUCTOS
        WHERE ID_PRODUCTO = ?
      `;

      const [productos]: any = await sequelizeAdmin.query(query, {
        replacements: [id]
      });

      if (productos.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.json({
        success: true,
        data: productos[0]
      });

    } catch (error: any) {
      console.error('Error al obtener producto:', error);
      res.status(500).json({ 
        error: 'Error al obtener producto',
        detalle: error.message 
      });
    }
  }

  /**
   * Actualizar producto
   * PUT /api/productos/:id
   * Body: { codigo?, nombre?, tipoProducto?, manejaVencimiento?, estado? }
   */
  static async actualizarProducto(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { codigo, nombre, tipoProducto, manejaVencimiento, estado } = req.body;

      // Verificar que el producto existe
      const [productoExiste]: any = await sequelizeAdmin.query(
        'SELECT ID_PRODUCTO FROM MD_PRODUCTOS WHERE ID_PRODUCTO = ?',
        { replacements: [id] }
      );

      if (productoExiste.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
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
      if (tipoProducto !== undefined) {
        if (!['ALIMENTO', 'TANGIBLE'].includes(tipoProducto)) {
          return res.status(400).json({ 
            error: 'tipoProducto debe ser ALIMENTO o TANGIBLE' 
          });
        }
        campos.push('TIPO_PRODUCTO = ?');
        valores.push(tipoProducto);
      }
      if (manejaVencimiento !== undefined) {
        campos.push('MANEJA_VENCIMIENTO = ?');
        valores.push(manejaVencimiento);
      }
      if (estado !== undefined) {
        campos.push('ESTADO = ?');
        valores.push(estado);
      }

      if (campos.length === 0) {
        return res.status(400).json({ 
          error: 'No se proporcionaron campos para actualizar' 
        });
      }

      valores.push(id);

      const query = `
        UPDATE MD_PRODUCTOS 
        SET ${campos.join(', ')}
        WHERE ID_PRODUCTO = ?
      `;

      await sequelizeAdmin.query(query, { replacements: valores });

      res.json({
        success: true,
        message: 'Producto actualizado exitosamente'
      });

    } catch (error: any) {
      console.error('Error al actualizar producto:', error);
      
      if (error.original?.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ 
          error: 'El código del producto ya existe' 
        });
      }
      
      res.status(500).json({ 
        error: 'Error al actualizar producto',
        detalle: error.message 
      });
    }
  }

  /**
   * Eliminar producto (soft delete)
   * DELETE /api/productos/:id
   */
  static async eliminarProducto(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verificar que el producto existe
      const [productoExiste]: any = await sequelizeAdmin.query(
        'SELECT ID_PRODUCTO FROM MD_PRODUCTOS WHERE ID_PRODUCTO = ?',
        { replacements: [id] }
      );

      if (productoExiste.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      // Soft delete: cambiar estado a 0
      await sequelizeAdmin.query(
        'UPDATE MD_PRODUCTOS SET ESTADO = 0 WHERE ID_PRODUCTO = ?',
        { replacements: [id] }
      );

      res.json({
        success: true,
        message: 'Producto desactivado exitosamente'
      });

    } catch (error: any) {
      console.error('Error al eliminar producto:', error);
      res.status(500).json({ 
        error: 'Error al eliminar producto',
        detalle: error.message 
      });
    }
  }

  /**
   * Buscar productos por nombre o código
   * GET /api/productos/buscar?q=producto
   */
  static async buscarProductos(req: Request, res: Response) {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({ 
          error: 'Se requiere el parámetro de búsqueda "q"' 
        });
      }

      const query = `
        SELECT 
          ID_PRODUCTO,
          CODIGO,
          NOMBRE,
          TIPO_PRODUCTO,
          MANEJA_VENCIMIENTO,
          ESTADO,
          FECHA_CREACION
        FROM MD_PRODUCTOS
        WHERE (NOMBRE LIKE ? OR CODIGO LIKE ?)
        AND ESTADO = 1
        ORDER BY NOMBRE ASC
        LIMIT 50
      `;

      const searchTerm = `%${q}%`;
      const [productos] = await sequelizeAdmin.query(query, {
        replacements: [searchTerm, searchTerm]
      });

      res.json({
        success: true,
        total: (productos as any[]).length,
        data: productos
      });

    } catch (error: any) {
      console.error('Error al buscar productos:', error);
      res.status(500).json({ 
        error: 'Error al buscar productos',
        detalle: error.message 
      });
    }
  }
}
