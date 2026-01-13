import { sequelizeAdmin } from "../connection/db_administracion";
import { InferAttributes, InferCreationAttributes, Model } from "sequelize";

class Inventario extends Model<
  InferAttributes<Inventario>,
  InferCreationAttributes<Inventario>
> {
  declare ID_INVENTARIO: number;
  declare ID_PRODUCTO: number;
  declare ID_LOTE: number;
  declare ID_UBICACION: number;
  declare CANTIDAD_ACTUAL: number;
  declare FECHA_ACTUALIZACION?: Date;
}

Inventario.init(
  {
    ID_INVENTARIO: {
      type: "bigint",
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ID_PRODUCTO: {
      type: "bigint",
      allowNull: false,
    },
    ID_LOTE: {
      type: "bigint",
      allowNull: false,
    },
    ID_UBICACION: {
      type: "bigint",
      allowNull: false,
    },
    CANTIDAD_ACTUAL: {
      type: "int",
      allowNull: false,
    },
    FECHA_ACTUALIZACION: {
      type: "timestamp",
      allowNull: true,
      defaultValue: "CURRENT_TIMESTAMP",
    },
  },
  {
    tableName: "MD_INVENTARIO",
    sequelize: sequelizeAdmin,
    timestamps: false,
  }
);

export { Inventario };
