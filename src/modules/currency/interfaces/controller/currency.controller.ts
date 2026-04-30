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
    async getCurrencies(): Promise<ICurrency[]> {
        return this.currencyService.getCurrencies();
    };

    @Get('filters')
    async getCurrencyByFilter(@Query() query: CurrencyQueryDTO): Promise<CurrencyEntity[]> {
        return this.currencyService.getCurrencyByFilter(query.currency, query.dateFrom, query.dateTo);
    };
};