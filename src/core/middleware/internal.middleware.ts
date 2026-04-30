import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, ForbiddenException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class InternalMiddleware implements NestMiddleware {
    async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
        // Extracción de la clave interna del Header
        const internalKey = req.headers['x-internal-key'];

        // Verificación de la existencia de la clave en los headers
        if (!internalKey) throw new UnauthorizedException('Internal access key is required');
        
        // Validación de la clave contra la variable de entorno
        const expectedKey = process.env.INTERNAL_API_KEY;

        if (!expectedKey) {
            console.error('[InternalMiddleware] INTERNAL_API_KEY is not defined in environment variables');
            throw new ForbiddenException('Internal server configuration error');
        };
        if (internalKey !== expectedKey) throw new ForbiddenException('Invalid internal access key');
        next();
    };
};
