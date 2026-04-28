import { Controller, Get } from '@nestjs/common';
import { AppRepository } from './app.repository';

@Controller('api/v1/welcome')
export class AppController {
  constructor(private readonly appRepository: AppRepository) { }

  @Get()
  welcomeAPI(): string {
    return this.appRepository.welcomeAPI("Bienvenido a la API del Servicio TC-BCV");
  };
};