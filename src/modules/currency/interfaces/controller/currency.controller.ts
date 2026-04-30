import { Controller, Get, Query } from '@nestjs/common';
import { CurrencyEntity } from '../../domain/currency.entity';
import { CurrencyService } from '../../services/currency.service';
import { CurrencyQueryDTO } from '../dto/currency.query.dto';
import type { ICurrency } from '../types/currency.interfaces';

@Controller('api/v1/currencies')
export class CurrencyController {
    constructor(
        private readonly currencyService: CurrencyService
    ) {};

    @Get()
    async getCurrencies(@Query() query: Partial<CurrencyQueryDTO>): Promise<ICurrency[]> {
        console.log('revision del query de entrada', query.currency);
        return this.currencyService.getCurrencies(query.currency);
    };

    @Get('filters')
    async getCurrencyByFilter(@Query() query: CurrencyQueryDTO): Promise<CurrencyEntity[]> {
        return this.currencyService.getCurrencyByFilter(query.currency, query.dateFrom, query.dateTo);
    };
};