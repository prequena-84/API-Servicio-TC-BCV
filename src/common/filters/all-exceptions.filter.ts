/**
 * ExceptionFilter: Es una interfaz que NestJS proporciona para crear filtros personalizados.
 * Catch: Es un decorador que le dice a Nest que esta clase va a "capturar" excepciones.
 * ArgumentsHost: Nos da acceso al contexto de la petición (por ejemplo: request, response, etc).
 * HttpException: Es la clase base para las excepciones HTTP en NestJS. Sirve para validar si la excepción es conocida o no.
 * Logger: Es un servicio de NestJS para registrar (loggear) información en consola.
 */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';

/**
 * Catch(): Decorador que marca esta clase como un filtro de excepciones global. Al no pasarle 
 * ningún parámetro, significa que va a capturar todas las excepciones posibles.
 */
@Catch()

// implements ExceptionFilter: Le decimos a TypeScript que esta clase debe implementar el método catch (es obligatorio).
export class AllExceptionsFilter<T> implements ExceptionFilter {
  /**
   *  Creamos una instancia del logger de NestJS.
   *  AllExceptionsFilter.name pasa el nombre de la clase como contexto para que cuando el logger imprima un mensaje, sepamos de dónde viene.
   *  Esto es para registrar errores en consola de forma organizada.
   */

  private readonly logger = new Logger(AllExceptionsFilter.name);
  /**
   *  Este es el método obligatorio cuando implementamos ExceptionFilter.
   *  exception: es el error que se lanzó en cualquier parte de la aplicación.
   *  host: es el contexto de ejecución donde ocurrió el error (HTTP, WebSocket, RPC, etc). En este caso vamos a trabajar con HTTP.
   */

  catch(exception: T, host: ArgumentsHost) {
    /**
     *  host.switchToHttp(): Estamos diciendo que queremos trabajar con contexto HTTP (NestJS soporta otros tipos como WebSocket, RPC, etc).
     *  ctx.getResponse(): Obtenemos el objeto response para poder devolver la respuesta al cliente.
     *  ctx.getRequest(): Obtenemos el objeto request para acceder a datos como la URL, headers, etc.
     */
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    /**
     *  Preguntamos: ¿El error es una excepción HTTP conocida?
     *  Si sí, usamos exception.getStatus() (por ejemplo: 400, 401, 404, etc).
     *  Si no, es un error inesperado → retornamos 500 (Internal Server Error).
     */
    const status = exception instanceof HttpException ? exception.getStatus() : 500;

    /**
     *  Si el error es una excepción HTTP conocida, extraemos el mensaje personalizado usando getResponse().
     *  Si no, devolvemos el texto genérico: "Internal server error".
     */
    const message = exception instanceof HttpException ? exception.getResponse() : 'Error interno del Servidor';

    /**
     *  Registramos el error en la consola para que el desarrollador pueda rastrear qué pasó.
     *  Especialmente si es un 400 (error de validación) o un 500 (error inesperado).
     */
    if (status >= 400) {
      this.logger.error(`Exception at ${request.method} ${request.url}:`, {
        status,
        message,
        exception: exception instanceof Error ? exception.stack : exception
      });
    }

    response.status(status).json({
      success: false,
      timeStamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  };
};