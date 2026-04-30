import { IsString, IsNotEmpty, IsNumber, IsIn, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import type { CurrencyType } from '../types/currency.types';

export class CurrencyQueryDTO {
    @IsString()
    @IsOptional()
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
    currency: CurrencyType | undefined;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    dateFrom: Date;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    dateTo: Date;
};