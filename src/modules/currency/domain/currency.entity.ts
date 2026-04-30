import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Unique } from "typeorm";
import type { ICurrency } from "../interfaces/types/currency.interfaces";
import type { CurrencyType } from "../interfaces/types/currency.types";

@Unique(['currency', 'lastUpdate'])
@Entity({ name: 'currency' })
export class CurrencyEntity implements ICurrency { 
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: [
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
        ],
        nullable: true,
    })
    currency: CurrencyType | null;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    country: string | null;

    // Tasa de Compra de la Moneda
    @Column({
        type: 'decimal',
        precision: 20,
        scale: 4,
        nullable: false,
    })
    purchaseRate: number;

    // Tasa de venta de la Moneda
    @Column({
        type: 'decimal',
        precision: 20,
        scale: 4,
        nullable: false,
    })
    saleRate: number;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    lastUpdate: Date;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;
};