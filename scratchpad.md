# Updated Plan to Fix TypeScript Errors and Pass E2E Tests

## Scripts to Check Against Documentation

### Product API
1. `src/products/products.ts`
   - [x] Base URL updated to `https://product.gelatoapis.com/v3`
   - [x] Documentation links added
   - [x] Check each endpoint against docs:
     - [x] `getCatalogs()` vs `Gelato_API_2-2-1_ListCatalogs.md`
       - Fixed base URL to match docs
       - Updated response type to match docs (array instead of ListResponse)
       - Removed storeId from path
     - [x] `getCatalog()` vs `Gelato_API_2-2-2_GetCatalog.md`
       - Fixed endpoint path to match docs
       - Updated ProductCatalog type to match docs
       - Added ProductAttribute and ProductAttributeValue types
     - [x] `getProductsInCatalog()` vs `Gelato_API_2-3-1_SearchProducts.md`
       - Fixed endpoint path to match docs
       - Response type already matches docs
     - [x] `getProduct()` vs `Gelato_API_2-3-2_GetProduct.md`
       - Fixed endpoint path to match docs
       - Response type already matches docs
     - [x] `getCoverDimensions()` vs `Gelato_API_2-3-3_CoverDimensions.md`
       - Fixed endpoint path to match docs
       - Response type already matches docs
     - [x] `getPrice()` vs `Gelato_API_2-4_Price.md`
       - Fixed endpoint path to match docs
       - Updated response type to match docs (array instead of single object)
       - Added optional parameters for country, currency, and pageCount
       - Updated ProductPrice type to match docs
     - [x] `getStockAvailability()` vs `Gelato_API_2-5_StockAvailability.md`
       - Fixed endpoint path to match docs
       - Response type already matches docs

### Shipment API
2. `src/shipment/shipment.ts`
   - [x] Base URL updated to `https://order.gelatoapis.com`
   - [x] Documentation links added
   - [x] Check each endpoint against docs:
     - [x] `getMethods()` vs `Gelato_API_3-1_Shipment.md`
       - Fixed endpoint path to match docs
       - Updated response type to match docs
       - Added optional country parameter
       - Removed currency parameter (not in docs)

### Orders API
3. `src/orders/orders-v4.ts`
   - [x] Base URL updated to `https://order.gelatoapis.com`
   - [x] Documentation links added
   - [x] Check each endpoint against docs:
     - [x] `create()` vs `Gelato_API_1-2_Create_Orders.md`
       - Fixed endpoint path to match docs
       - Response type already matches docs
     - [x] `get()` vs `Gelato_API_1-3_GetOrders.md`
       - Fixed endpoint path to match docs
       - Response type already matches docs
     - [x] `patch()` vs `Gelato_API_1-3_GetOrders.md` & `Gelato_API_1-5_CancelOrder.md`
       - Fixed endpoint path to match docs
       - Request and response types match docs
     - [x] `delete()` vs `Gelato_API_1-6_DeleteDraftOrder.md`
       - Fixed endpoint path to match docs
       - Response type already matches docs
     - [x] `cancel()` vs `Gelato_API_1-5_CancelOrder.md`
       - Fixed endpoint path to match docs
       - Response type already matches docs
     - [x] `search()` vs `Gelato_API_1-4_SearchOrders.md`
       - Fixed endpoint path to match docs
       - Response type already matches docs

## Progress Log

### Product API Check
- Completed `getCatalogs()`:
  - Fixed base URL to match docs: `https://product.gelatoapis.com/v3`
  - Updated response type to match docs (array instead of ListResponse)
  - Removed storeId from path

- Completed `getCatalog()`:
  - Fixed endpoint path to match docs
  - Updated ProductCatalog type to match docs
  - Added ProductAttribute and ProductAttributeValue types

- Completed `getProductsInCatalog()`:
  - Fixed endpoint path to match docs
  - Response type already matches docs

- Completed `getProduct()`:
  - Fixed endpoint path to match docs
  - Response type already matches docs

- Completed `getCoverDimensions()`:
  - Fixed endpoint path to match docs
  - Response type already matches docs

- Completed `getPrice()`:
  - Fixed endpoint path to match docs
  - Updated response type to match docs (array instead of single object)
  - Added optional parameters for country, currency, and pageCount
  - Updated ProductPrice type to match docs

- Completed `getStockAvailability()`:
  - Fixed endpoint path to match docs
  - Response type already matches docs

### Shipment API Check
- Completed `getMethods()`:
  - Fixed endpoint path to match docs
  - Updated response type to match docs
  - Added optional country parameter
  - Removed currency parameter (not in docs)

### Orders API Check
- Completed `create()`:
  - Fixed endpoint path to match docs
  - Response type already matches docs

- Completed `get()`:
  - Fixed endpoint path to match docs
  - Response type already matches docs

- Completed `patch()`:
  - Fixed endpoint path to match docs
  - Request and response types match docs

- Completed `delete()`:
  - Fixed endpoint path to match docs
  - Response type already matches docs

- Completed `cancel()`:
  - Fixed endpoint path to match docs
  - Response type already matches docs

- Completed `search()`:
  - Fixed endpoint path to match docs
  - Response type already matches docs

## Test Fixes Completed
- Fixed Product API tests:
  - Updated mock response structure for `getCatalogs()`
  - Fixed POST body expectations for `getProductsInCatalog()`
  - Updated param name from `pagesCount` to `pageCount` for `getCoverDimensions()`
  - Fixed endpoint path from `/price` to `/prices` for `getPrice()`
  - Updated endpoint and request body for `getStockAvailability()`

- Fixed Shipment API tests:
  - Updated mock response structure to match API contract
  - Fixed endpoint path expectations

- Fixed Orders API tests:
  - Corrected import statement for `GelatoOrdersV4Api`
  - Updated test expectations to match V4 API contract

All tests are now passing. The codebase is aligned with the latest API documentation and contracts.