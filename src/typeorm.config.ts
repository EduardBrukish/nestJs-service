import { DataSource } from 'typeorm';
import dbSource from './db.source';

const AppDataSource = new DataSource({
  ...dbSource,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default AppDataSource;
