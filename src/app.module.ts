import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppRepository } from './app.repository';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

// Importación del Modulo de Conexion a la Base de Datos MySQL
import { DatabaseModule } from './config/database/database.module';
import { CurrencyModule } from './modules/currency/currency.module';

// Importación del Middleware de Autenticación Interna
import { InternalMiddleware } from './core/middleware/internal.middleware';

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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Protege todas las rutas del módulo de monedas con la API Key interna
    consumer
      .apply(InternalMiddleware)
      .forRoutes('api/v1/currencies');
  };
};