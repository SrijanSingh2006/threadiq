# Tableau Desktop & Server Integration Guide

## 1. PostgreSQL Direct Connectivity
1. In Tableau Desktop, select **Connect to a Data Source** $\rightarrow$ **PostgreSQL**.
2. Host: `localhost` | Port: `5432` | Database: `threadiq`.
3. Drag `Fact_Product_Events` to canvas.
4. Join `Dim_Products` on `product_id = id`.
5. Join `Dim_Customers` on `user_id = customer_code`.

## 2. CSV Star-Schema Exports
If connecting offline, export pre-formatted star-schema datasets from ThreadIQ via:
- `/api/reports/export/csv/funnel_analysis`
- `/api/reports/export/csv/order_fulfilment`
- `/api/reports/export/excel`\n