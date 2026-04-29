import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyEntity } from './domain/currency.entity';
import { CurrencyController } from './interfaces/controller/currency.controller';
import { CurrencyRepository } from './repositories/currency.repository';
import { CurrencyService } from './services/currency.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([CurrencyEntity]),
  ],
  controllers: [CurrencyController],
  providers: [CurrencyRepository, CurrencyService],
})
export class CurrencyModule { };