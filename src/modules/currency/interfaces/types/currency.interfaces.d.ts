import type { CurrencyType } from './currency.types';

interface ICurrency {
    id?: number;
    currency: CurrencyType | null;
    country: string | null;
    purchaseRate: number;
    saleRate: number;
    lastUpdate: Date;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}