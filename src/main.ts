import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Importamos el filtro de excepciones globales
//import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita la transformación y validación global de DTOs (@Transform, @IsString, etc.)
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Aumentar el límite del body para permitir archivos Base64 grandes
  //app.use(json({ limit: '50mb' }));
  //app.use(urlencoded({ limit: '50mb', extended: true }));

  // Implementación del uso de CORS
  /*app.enableCors({
    origin: [
      //'http://localhost:5173',
      //'https://mbt6vmss8i.us-east-1.awsapprunner.com',
      //'https://tarschat.com',
      //'https://tars-hosting-bucket-us-east-1.s3.us-east-1.amazonaws.com',
    ],
    //methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    //credentials: true,
  });*/

  // Implemantación del uso de capture de Excepciones Globales
  //app.useGlobalFilters(new AllExceptionsFilter());

  const PORT = Number(process.env.PORT ?? 3000);
  await app.listen(PORT, '0.0.0.0');
  console.log(`Server running: http://localhost:${PORT}/api/v1/welcome, Stage: ${process.env.NODE_ENV}`)
}
bootstrap();