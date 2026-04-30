SET NAMES 'utf8mb4'; 

-- Crear bases de datos
CREATE DATABASE IF NOT EXISTS db_tc_bcv_dev
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Permiso de usuario
GRANT ALL PRIVILEGES ON db_tc_bcv_dev.* TO 'userdev'@'%';
FLUSH PRIVILEGES;

-- --- Tablas para Development ---
USE db_tc_bcv_dev;

-- ============================================================================
-- Core Tables para el registro de las tasas de cambios del BDV - Refactorización API-Microservicio-TC-BCV
-- ============================================================================

-- 1. tc_bcv Table: Tabla central de Tasas
CREATE TABLE IF NOT EXISTS currency (
    id INT AUTO_INCREMENT PRIMARY KEY,
    currency ENUM('EUR','CNY','TRY','RUB','USD','CAD','INR','JPY','ARS','BRL','CLP','COP','UYU','PEN','BOB','MXP','CUC','NIO','DOP','TTD','ANG') NULL COMMENT 'Distingue la abreviatura de la moneda',
    country varchar(100) NULL COMMENT 'Distingue el nombre de la moneda',
    purchaseRate decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Indica la tasa de compra de la moneda',
    saleRate decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Indica la tasa de venta de la moneda',
    lastUpdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Indica la fecha y hora de la última actualización',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Indica la fecha y hora de creación',
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Indica la fecha y hora de actualización',
    deletedAt TIMESTAMP DEFAULT NULL COMMENT 'Indica la fecha y hora de eliminación',
    UNIQUE KEY unique_currency_lastUpdate (currency, lastUpdate) COMMENT 'Evita registros duplicados por moneda y fecha de actualización'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;