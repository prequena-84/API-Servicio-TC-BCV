import { IsString, IsNotEmpty, IsNumber, IsIn, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import type { ICurrency } from '../types/currency.interfaces';
import type { CurrencyType } from '../types/currency.types';

export class CurrencyDto implements ICurrency {
    @IsString()
    @IsNotEmpty()
    @IsIn([
        "EUR", 
        "CNY", 
        "TRY", 
        "RUB", 
        "USD", 
        "CAD", 
        "INR", 
        "JPY", 
        "ARS", 
        "BRL", 
        "CLP", 
        "COP", 
        "UYU", 
        "PEN", 
        "BOB", 
        "MXP", 
        "CUC", 
        "NIO", 
        "DOP", 
        "TTD", 
        "ANG",
    ])
    currency: CurrencyType | null;

    @IsString()
    @IsNotEmpty()
    country: string | null;

    @IsNumber()
    @IsNotEmpty()
    purchaseRate: number;

    @IsNumber()
    @IsNotEmpty()
    saleRate: number;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    lastUpdate: Date;
};