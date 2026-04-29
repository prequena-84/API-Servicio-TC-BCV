import { Controller, Get } from '@nestjs/common';
import { CurrencyService } from '../../services/currency.service';

import type { ICurrency } from '../types/currency.interfaces';

@Controller('api/v1/currencies')
export class CurrencyController {
    constructor(
        private readonly currencyService: CurrencyService
    ) {};

    @Get()
    async getCurrency(): Promise<ICurrency[]> {
        return this.currencyService.getCurrency();
    };
};