import { registerAs } from '@nestjs/config';
import type { IDatabaseConfig } from './database.config.interfaces';

export default registerAs('database', (): IDatabaseConfig => ({
    type: 'mysql',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    username: process.env.DB_USER ?? 'userdev',
    password: process.env.DB_PASSWORD ?? 'dev1234',
    database: process.env.DB_NAME ?? (process.env.NODE_ENV === 'development' ? 'db_tc_bcv_dev' : 'db_tc_bcv'),
    charset: 'utf8mb4',
    autoLoadEntities: process.env.DB_AUTOLOAD_ENTITIES === 'true' ? true : false,
    synchronize: process.env.DB_SYNCHRONIZE === 'true' ? true : false,
}));