import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppRepository } from './app.repository';
import { ConfigModule } from '@nestjs/config';

// Importación del Modulo de Conexion a la Base de Datos MySQL
import { DatabaseModule } from './config/database/database.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV ?? 'development'}`,
        '.env',
      ],
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppRepository],
})
export class AppModule { };