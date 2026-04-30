import { IsString, IsNotEmpty, IsNumber, IsIn, IsDate, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import type { CurrencyType } from '../types/currency.types';

export class CurrencyQueryDTO {
    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value) 
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
    ], { each: true }) 
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