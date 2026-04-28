import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyEntity } from './domain/currency.entity';
import { CurrencyController } from './interfaces/controller/currency.controller';
import { CurrencyRepository } from './repositories/repositories.repository';

@Module({
  imports:[
    TypeOrmModule.forFeature([CurrencyEntity]),
  ],
  controllers: [CurrencyController],
  providers: [CurrencyRepository],
})
export class CurrencyModule { };