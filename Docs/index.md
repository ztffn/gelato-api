# Gelato API Integration Guide

## Overview
This document provides a quick reference for integrating with the Gelato API. The API allows you to create and manage print products, handle orders, and manage your store's catalog.

## Base URL
```
https://order.gelatoapis.com
```

## Authentication
All API requests require an API key to be passed in the header:
```
X-API-KEY: {{apiKey}}
```

## Key Endpoints

### Products
- [Create Product from Template](Gelato_API_4-1-2-1_CreateProductFromTemplate.md)
  - `POST /stores/{{storeId}}/products:create-from-template`
  - Creates a new product based on a template
  - Required fields: templateId, title, description
  - Supports variants and image placeholders
  - Image formats: jpg, jpeg, png, pdf
  - Image fit methods: slice (default), meet

- [Get Product](Gelato_API_4-1-2-2_GetProduct.md)
  - `GET /stores/{{storeId}}/products/{{productId}}`
  - Retrieves detailed product information
  - Includes variants, status, and preview URLs

- [List Products](Gelato_API_4-1-2-3_ListProducts.md)
  - `GET /stores/{{storeId}}/products`
  - Lists all products in a store
  - Supports pagination and filtering

### Templates
- [Get Template](Gelato_API_4-2_GetTemplate.md)
  - `GET /stores/{{storeId}}/templates/{{templateId}}`
  - Retrieves template information for product creation

### Orders
- [Create Orders](Gelato_API_1-2_Create_Orders.md)
  - `POST /stores/{{storeId}}/orders`
  - Creates new print orders
  - Supports multiple items per order

- [Get Orders](Gelato_API_1-3_GetOrders.md)
  - `GET /stores/{{storeId}}/orders`
  - Retrieves order information
  - Supports filtering and pagination

- [Search Orders](Gelato_API_1-4_SearchOrders.md)
  - `GET /stores/{{storeId}}/orders/search`
  - Advanced order search functionality

- [Cancel Order](Gelato_API_1-5_CancelOrder.md)
  - `POST /stores/{{storeId}}/orders/{{orderId}}/cancel`
  - Cancels an existing order

- [Delete Draft Order](Gelato_API_1-6_DeleteDraftOrder.md)
  - `DELETE /stores/{{storeId}}/orders/{{orderId}}`
  - Deletes a draft order

### Catalog Management
- [List Catalogs](Gelato_API_2-2-1_ListCatalogs.md)
  - `GET /stores/{{storeId}}/catalogs`
  - Lists available product catalogs

- [Get Catalog](Gelato_API_2-2-2_GetCatalog.md)
  - `GET /stores/{{storeId}}/catalogs/{{catalogId}}`
  - Retrieves catalog details

- [Search Products](Gelato_API_2-3-1_SearchProducts.md)
  - `GET /stores/{{storeId}}/products/search`
  - Searches for products in the catalog

### Product Information
- [Get Product Details](Gelato_API_2-3-2_GetProduct.md)
  - `GET /stores/{{storeId}}/products/{{productId}}`
  - Retrieves detailed product information

- [Cover Dimensions](Gelato_API_2-3-3_CoverDimensions.md)
  - `GET /stores/{{storeId}}/products/{{productId}}/cover-dimensions`
  - Gets product cover dimensions

### Pricing and Availability
- [Price Information](Gelato_API_2-4_Price.md)
  - `GET /stores/{{storeId}}/products/{{productId}}/price`
  - Retrieves product pricing information

- [Stock Availability](Gelato_API_2-5_StockAvailability.md)
  - `GET /stores/{{storeId}}/products/{{productId}}/stock-availability`
  - Checks product stock availability

### Webhooks
- [Webhook Integration](Gelato_API_5_Webhooks.md)
  - Configure webhooks for real-time updates
  - Supports order status changes and other events

## Common Response Fields
- `id`: Unique identifier
- `status`: Current status (e.g., created, active, publishing_error)
- `createdAt`: Creation timestamp (ISO 8601)
- `updatedAt`: Last update timestamp (ISO 8601)

## Implementation Details

### Product Creation
- Maximum 13 tags per product
- Tag length limit: 255 characters (20 for Etsy)
- Image placeholder names must match template exactly
- Variant handling:
  - Can create with all template variants
  - Can create with subset of variants
  - Each variant requires templateVariantId

### File Requirements
- Supported image formats: jpg, jpeg, png, pdf
- Image fit methods:
  - `slice`: Fill placeholder, crop overflow
  - `meet`: Fit entire image, transparent background

### Status Codes
- `created`: Initial creation
- `publishing`: Being published to store
- `active`: Successfully published
- `publishing_error`: Failed to publish

### Sales Channels
- `web`: Standard web store (default)
- `global`: Point of Sale channel (Shopify only)

## Error Handling
- All errors return appropriate HTTP status codes
- Error responses include detailed messages
- Common status codes:
  - 400: Bad Request
  - 401: Unauthorized
  - 404: Not Found
  - 429: Too Many Requests

## Best Practices
1. Always validate input data before sending requests
2. Implement proper error handling
3. Use pagination for list endpoints
4. Cache frequently accessed data
5. Monitor webhook events for real-time updates
6. Keep API keys secure and rotate them regularly
7. Verify image placeholder names match template exactly
8. Handle variant creation carefully to avoid missing options
9. Implement proper image format validation
10. Consider image fit method based on design requirements

## Rate Limits
- Monitor response headers for rate limit information
- Implement exponential backoff for retries
- Consider implementing request queuing for bulk operations
