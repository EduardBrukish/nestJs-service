import { DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

const dbSource: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
};

export default dbSource;
