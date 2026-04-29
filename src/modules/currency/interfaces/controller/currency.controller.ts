import { Controller, Get } from '@nestjs/common';
import { CurrencyService } from '../../services/currency.service';

@Controller('api/v1/currency')
export class CurrencyController {
    constructor(
        private readonly currencyService: CurrencyService
    ) {};

    @Get()
    async createCurrency(): Promise<void> {
        return this.currencyService.createCurrency();
    };
};