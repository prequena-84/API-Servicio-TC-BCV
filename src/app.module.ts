import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppRepository } from './app.repository';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

// Importación del Modulo de Conexion a la Base de Datos MySQL
import { DatabaseModule } from './config/database/database.module';
import { CurrencyModule } from './modules/currency/currency.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV ?? 'development'}`,
        '.env',
      ],
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    CurrencyModule,
  ],
  controllers: [AppController],
  providers: [AppRepository],
})
export class AppModule { };