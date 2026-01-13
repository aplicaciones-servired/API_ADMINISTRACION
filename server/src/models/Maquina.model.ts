import { InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelizeAdmin } from "../connection/db_administracion";

class MaquinaModel extends Model<
  InferAttributes<MaquinaModel>,
  InferCreationAttributes<MaquinaModel>
> {
  declare ID_MAQUINA: number;
  declare CODIGO: string;
  declare NOMBRE: string;
  declare ESTADO: "ACTIVA" | "INACTIVA" | "MANTENIMIENTO";
  declare FECHA_COMPRA?: Date;
  declare FECHA_INICIO_OPERACION?: Date;
  declare UBICACION?: string;
  declare OBSERVACIONES?: string;
  declare FECHA_CREACION?: Date;
}

MaquinaModel.init(
  {
    ID_MAQUINA: {
      type: "bigint",
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    CODIGO: {
      type: "varchar(50)",
      allowNull: false,
      unique: true,
    },
    NOMBRE: {
      type: "varchar(100)",
      allowNull: false,
    },
    ESTADO: {
      type: "enum('ACTIVA','INACTIVA','MANTENIMIENTO')",
      allowNull: false,
    },
    FECHA_COMPRA: {
      type: "date",
      allowNull: true,
    },
    FECHA_INICIO_OPERACION: {
      type: "date",
      allowNull: true,
    },
    UBICACION: {
      type: "varchar(150)",
      allowNull: true,
    },
    OBSERVACIONES: {
      type: "text",
      allowNull: true,
    },
    FECHA_CREACION: {
      type: "timestamp",
      allowNull: true,
      defaultValue: sequelizeAdmin.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    sequelize: sequelizeAdmin,
    tableName: "MD_MAQUINAS",
    timestamps: false,
  }
);

export { MaquinaModel };
