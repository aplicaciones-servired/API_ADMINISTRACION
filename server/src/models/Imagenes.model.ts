import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelizeAdmin } from "../connection/db_administracion";

class Imagenes extends Model<
  InferAttributes<Imagenes>,
  InferCreationAttributes<Imagenes>
> {
  declare ID_IMAGEN: number;
  declare TIPO_ENTIDAD: "INVENTARIO" | "ARQUEO";
  declare ID_ENTIDAD: number;
  declare RUTA_IMAGEN: string;
  declare NOMBRE_ARCHIVO?: string;
  declare TIPO_ARCHIVO?: string;
  declare TAMANO_BYTES?: number;
  declare FECHA_CARGA?: Date;
  declare LOGINREGISTRO?: string;
}

Imagenes.init(
  {
    ID_IMAGEN: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    TIPO_ENTIDAD: {
      type: DataTypes.ENUM("INVENTARIO", "ARQUEO"),
      allowNull: false,
    },
    ID_ENTIDAD: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    RUTA_IMAGEN: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    NOMBRE_ARCHIVO: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    TIPO_ARCHIVO: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    TAMANO_BYTES: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    FECHA_CARGA: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelizeAdmin.literal("CURRENT_TIMESTAMP"),
    },
    LOGINREGISTRO: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeAdmin,
    tableName: "MD_IMAGENES",
    timestamps: false,
  }
);

// Tipos para el controlador
export interface Imagen {
  ID_IMAGEN: number;
  TIPO_ENTIDAD: "INVENTARIO" | "ARQUEO";
  ID_ENTIDAD: number;
  RUTA_IMAGEN: string;
  NOMBRE_ARCHIVO?: string;
  TIPO_ARCHIVO?: string;
  TAMANO_BYTES?: number;
  FECHA_CARGA?: Date;
  LOGINREGISTRO?: string;
}

export interface ImagenResponse extends Imagen {
  url: string;
}

export { Imagenes };
