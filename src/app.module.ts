import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppRepository } from './app.repository';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppRepository],
})
export class AppModule { };