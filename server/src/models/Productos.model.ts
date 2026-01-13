// ID_PRODUCTO	bigint	(null)	NO	PRI	(null)	auto_increment	select,insert,update	
// CODIGO	varchar(50)	utf8mb4_0900_ai_ci	NO	UNI	(null)		select,insert,update	
// NOMBRE	varchar(150)	utf8mb4_0900_ai_ci	NO		(null)		select,insert,update	
// TIPO_PRODUCTO	enum('ALIMENTO','TANGIBLE')	utf8mb4_0900_ai_ci	NO		(null)		select,insert,update	
// MANEJA_VENCIMIENTO	tinyint(1)	(null)	NO		1		select,insert,update	
// ESTADO	tinyint(1)	(null)	NO		1		select,insert,update	
// FECHA_CREACION	timestamp	(null)	YES		CURRENT_TIMESTAMP	DEFAULT_GENERATED	select,insert,update	}


import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelizeAdmin } from '../connection/db_administracion';


class ProductosModel extends Model<InferAttributes<ProductosModel>, InferCreationAttributes<ProductosModel>> 
{
    declare ID_PRODUCTO: number;
    declare CODIGO: string
    declare NOMBRE: string
    declare TIPO_PRODUCTO: 'ALIMENTO' | 'TANGIBLE'
    declare MANEJA_VENCIMIENTO: boolean
    declare ESTADO: boolean
    declare FECHA_CREACION?: Date
}

ProductosModel.init(
    {
        ID_PRODUCTO: {
            type: 'bigint',
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        CODIGO: {
            type: 'varchar(50)',
            allowNull: false,
            unique: true,
        },
        NOMBRE: {
            type: 'varchar(150)',
            allowNull: false,
        },
        TIPO_PRODUCTO: {
            type: 'enum(\'ALIMENTO\',\'TANGIBLE\')',
            allowNull: false,
        },
        MANEJA_VENCIMIENTO: {
            type: 'tinyint(1)',
            allowNull: false,
            defaultValue: 1,
        },
        ESTADO: {
            type: 'tinyint(1)',
            allowNull: false,
            defaultValue: 1,
        },
        FECHA_CREACION: {
            type: 'timestamp',
            allowNull: true,
            defaultValue: sequelizeAdmin.literal('CURRENT_TIMESTAMP'),
        },
    },
    {
        sequelize: sequelizeAdmin,
        tableName: 'MD_PRODUCTOS',
        timestamps: false,
    }
);