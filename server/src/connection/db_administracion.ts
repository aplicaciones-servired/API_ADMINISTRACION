import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const DB_ADMIN_USER = process.env.DB_ADMIN_USER;
const DB_ADMIN_PASS = process.env.DB_ADMIN_PASS;
const DB_ADMIN_HOST = process.env.DB_ADMIN_HOST;
const DB_ADMIN_BASENAME = process.env.DB_ADMIN_BASENAME;
const DB_PORT = Number(process.env.DB_PORT);

export const sequelizeAdmin = new Sequelize(DB_ADMIN_BASENAME!, DB_ADMIN_USER!, DB_ADMIN_PASS!, {
  host: DB_ADMIN_HOST,
  port: DB_PORT,
  dialect: 'mysql'
});
