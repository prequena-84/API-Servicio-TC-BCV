SET NAMES 'utf8mb4'; 

-- Crear bases de datos
CREATE DATABASE IF NOT EXISTS db_tc_bcv
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Permiso de usuario
GRANT ALL PRIVILEGES ON db_tc_bcv.* TO 'userdev'@'%';
FLUSH PRIVILEGES;

-- --- Tablas para Development ---
USE db_tc_bcv;

-- ============================================================================
-- Core Tables para el registro de las tasas de cambios del BDV - Refactorización API-Microservicio-TC-BCV
-- ============================================================================

-- 1. tc_bcv Table: Tabla central de Tasas
CREATE TABLE IF NOT EXISTS tcBcv (
    id INT AUTO_INCREMENT PRIMARY KEY,
    currencyCode ENUM('EUR','CNY','TRY','RUB','USD','CAD','INR','JPY','ARS','BRL','CLP','COP','UYU','PEN','BOB','MXP','CUC','NIO','DOP','TTD','ANG') NOT NULL COMMENT 'Distingue la abreviatura de la moneda',
    currencyName varchar(100) NOT NULL COMMENT 'Distingue el nombre de la moneda',
    purchaseRate decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Indica la tasa de compra de la moneda',
    saleRate decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Indica la tasa de venta de la moneda',
    lastUpdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Indica la fecha y hora de la última actualización',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Indica la fecha y hora de creación',
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Indica la fecha y hora de actualización',
    deletedAt TIMESTAMP NULL DEFAULT NULL COMMENT 'Indica la fecha y hora de eliminación'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;