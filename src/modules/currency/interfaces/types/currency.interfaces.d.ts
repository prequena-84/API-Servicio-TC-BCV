import type { CurrencyType } from './currency.types';

interface ICurrency {
    id?: number;
    currencyCode: CurrencyType | null;
    currencyName?: string
    purchaseRate: number;
    saleRate: number;
    lastUpdate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}