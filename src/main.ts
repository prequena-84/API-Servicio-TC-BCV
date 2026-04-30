import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Importamos el filtro de excepciones globales
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita la transformación y validación global de DTOs (@Transform, @IsString, etc.)
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Aumentar el límite del body para permitir archivos Base64 grandes (mantenemos comentado como pediste)
  //app.use(json({ limit: '50mb' }));
  //app.use(urlencoded({ limit: '50mb', extended: true }));

  // Configuración dinámica de CORS desde el archivo .env
  //const origins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [];
  
  /*app.enableCors({
    origin: origins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });*/

  // Implemantación del uso de capture de Excepciones Globales
  app.useGlobalFilters(new AllExceptionsFilter());

  const PORT = Number(process.env.PORT ?? 3000);
  await app.listen(PORT, '0.0.0.0');
  console.log(`Server running: http://localhost:${PORT}/api/v1/welcome, Stage: ${process.env.NODE_ENV}`)
}
bootstrap();