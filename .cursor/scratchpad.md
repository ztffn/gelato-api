# Background and Motivation
The goal is to ensure all E2E tests for the gelato-api project pass, with all API endpoints, method names, and flows aligned to the latest documentation. This ensures reliability and maintainability of the integration with the Gelato API.

# Key Challenges and Analysis
- Ensuring all endpoint URLs and method signatures match the latest API documentation
- Handling breaking changes between API versions
- Ensuring test data is set up and cleaned up correctly
- Improving error handling and test clarity

# High-level Task Breakdown
- [x] Review and update all Product API endpoints and method signatures in tests
- [x] Review and update all Shipment API endpoints and method signatures in tests
- [x] Review and update all Orders API endpoints and method signatures in tests
- [x] Align all test flows and data setup/cleanup with API contracts
- [x] Improve error handling and test assertions for clarity
- [x] Confirm all code changes match the latest documentation
- [ ] Run E2E tests and address any failures
- [ ] Document any breaking changes or API mismatches if found

# Project Status Board
- [x] Product API test alignment
- [x] Shipment API test alignment
- [x] Orders API test alignment
- [x] Test data setup and cleanup
- [x] Error handling improvements
- [x] Code review for API contract alignment
- [ ] E2E test execution
- [ ] Documentation update if needed

# Current Status / Progress Tracking

## Test Results
- ✅ All 17 E2E tests are passing
- ✅ Total test time: 25.742 seconds
- ✅ No more company information errors
- ✅ Order creation, patching, and cancellation all working correctly

## API Status
- Product API: Fully functional
- Orders API: Fully functional
- Shipment API: Fully functional

## Recent Fixes
1. Company Information:
   - Resolved by setting up company profile in Gelato dashboard
   - Required for order creation and management

2. Patch Operation:
   - Increased timeout to 15 seconds
   - Operation involves multiple steps:
     - Processing the order
     - Calculating prices
     - Generating receipts
     - Setting up shipping
     - Updating order status

## Next Steps
- Monitor API performance and response times
- Consider adding more detailed logging for debugging
- Document API requirements and setup process

# E2E Test Failures
- **Product API:** `getCatalogs()` returned `undefined`, causing all subsequent catalog/product tests to fail. This indicates the Product API is not returning data as expected, possibly due to a misconfigured base URL, API key, or network issue.
- **Order/Shipment API:** All order and shipment tests failed with errors like `No route found for "POST https://order.ie.live.gelato.tech/api/orders"`. This indicates the base URL is incorrect. The code is using `https://order.ie.live.gelato.tech/api/` instead of the documented `https://order.gelatoapis.com`.

**Next steps:**
1. Check and fix all API base URLs in the SDK code:
   - Product API: Should be `https://product.gelatoapis.com/v3`
   - Order API: Should be `https://order.gelatoapis.com`
   - Shipment API: Should be `https://order.gelatoapis.com`
2. Ensure the `.env` file contains a valid API key and is being loaded.
3. After fixing the base URLs, re-run the E2E tests.

# Next Steps
- Contact the API support team to clarify if the company information needs to be set in the portal or if there are additional headers or payload fields required.

# Executor's Feedback or Assistance Requests
All preparatory work is complete. Ready to run E2E tests. Will capture and address any failures that occur during test execution.

# Lessons
- Always verify endpoint paths and method signatures against the latest API docs.
- Ensure test data is cleaned up after each run to avoid pollution.
- Use clear and actionable error messages in test assertions. 



////
Copy of old examples from docs, might be used for a quick reference doc, do not delete:
///

### 1. `should get catalogs`
- **Issue:** `getCatalogs()` returns `undefined`, causing `cats1?.length` to be `undefined`.
- **Plan:**
  - Verify the Product API base URL is correct (`https://product.gelatoapis.com/v3`).
  - Check the API key and network connectivity.
  - Add logging to `getCatalogs()` to capture the raw response.
  - Update the test to handle `undefined` gracefully or mock the response.
- **Correct URL:** `GET https://product.gelatoapis.com/v3/catalogs`
- **Example:**
  ```
  $ curl -X GET https://product.gelatoapis.com/v3/catalogs \
      -H 'X-API-KEY: {{apiKey}}'
  ```

### 2. `should get specific catalog`
- **Issue:** `Cannot read properties of undefined (reading 'catalogUid')` because `cats1[0]` is `undefined`.
- **Plan:**
  - Ensure `getCatalogs()` returns a valid array.
  - Add a check to skip this test if `cats1` is empty or `undefined`.
  - Mock the `getCatalogs()` response if the API is unreliable.
- **Correct URL:** `GET https://product.gelatoapis.com/v3/catalogs/{{catalogUid}}`
- **Example:**
  ```
  $ curl -X GET "https://product.gelatoapis.com/v3/catalogs/posters" \
      -H 'X-API-KEY: {{apiKey}}'
  ```

### 3. `should get products in specific catalog`
- **Issue:** Same as above, `cats1[0]` is `undefined`.
- **Plan:**
  - Same as `should get specific catalog`.
  - Ensure `getProductsInCatalog()` is called with a valid `catalogUid`.
- **Correct URL:** `POST https://product.gelatoapis.com/v3/catalogs/{{catalogUid}}/products:search`
- **Example:**
  ```
  $ curl -X POST "https://product.gelatoapis.com/v3/catalogs/posters/products:search" \
      -H 'X-API-KEY: {{apiKey}}' \
      -H 'Content-Type: application/json' \
      -d '{
          "attributeFilters": {
              "Orientation": ["hor", "ver"],
              "CoatingType": ["none"]
          },
          "limit": 50,
          "offset": 0
      }'
  ```

### 4. `should get specific product`
- **Issue:** `API Error: ProductUid 'undefined' doesn't exist`.
- **Plan:**
  - Ensure a valid `productUid` is passed to `getProduct()`.
  - Mock the `getProduct()` response if the API is unreliable.
  - Add logging to capture the `productUid` being used.
- **Correct URL:** `GET https://product.gelatoapis.com/v3/products/{{productUid}}`
- **Example:**
  ```
  $ curl -X GET "https://product.gelatoapis.com/v3/products/cards_pf_bb_pt_110-lb-cover-uncoated_cl_4-0_hor" \
      -H 'X-API-KEY: {{apiKey}}'
  ```

### 5. `should get prices for specific product`
- **Issue:** `API Error: There are errors in submitted data`.
- **Plan:**
  - Verify the request payload for `getPrice()`.
  - Ensure all required parameters are provided.
  - Mock the `getPrice()` response if the API is unreliable.
- **Correct URL:** `GET https://product.gelatoapis.com/v3/products/{{productUid}}/prices`
- **Example:**
  ```
  $ curl -X GET "https://product.gelatoapis.com/v3/products/{{productUid}}/prices" \
      -H 'X-API-KEY: {{apiKey}}'
  ```

### 6. `should get stock availability for specific products`
- **Issue:** `API Error: No products provided, at least one is required`.
- **Plan:**
  - Ensure a valid array of `productUids` is passed to `getStockAvailability()`.
  - Mock the `getStockAvailability()` response if the API is unreliable.
- **Correct URL:** `POST https://product.gelatoapis.com/v3/stock/region-availability`
- **Example:**
  ```
  $ curl --location --request POST 'https://product.gelatoapis.com/v3/stock/region-availability' \
      -H 'X-API-KEY: {{apiKey}}' \
      -H 'Content-Type: application/json' \
      -d '{
        "products": [
          "wall_hanger_product_whs_290-mm_whc_white_whm_wood_whp_w14xt20-mm",
          "frame_and_poster_product_frs_300x400-mm_frc_black_frm_wood_frp_w12xt22-mm_gt_plexiglass__pf_300x400-mm_pt_170-gsm-coated-silk_cl_4-0_ct_none_prt_none_hor",
          "non-existing-product-uid"
        ]
      }'
  ```

## Orders API Tests

### 1. `should create order`
- **Issue:** `API Error: No route found for "POST https://order.ie.live.gelato.tech/api/orders"`.
- **Plan:**
  - Verify the Orders API base URL is correct (`https://order.gelatoapis.com`).
  - Check for any legacy code or configuration overriding the base URL.
  - Mock the `create()` response if the API is unreliable.
- **Correct URL:** `POST https://order.gelatoapis.com/v4/orders`
- **Example:**
  ```
  $ curl -X POST \
     https://order.gelatoapis.com/v4/orders \
     -H 'Content-Type: application/json' \
     -H 'X-API-KEY: {{apiKey}}' \
     -d '{
          "orderType": "order",
          "orderReferenceId": "{{myOrderId}}",
          "customerReferenceId": "{{myCustomerId}}",
          "currency": "USD",
          "items": [
              {
                  "itemReferenceId": "{{myItemId1}}",
                  "productUid": "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_classic_gsi_s_gco_white_gpr_4-4",
                  "files": [
                    {
                      "type": "default",
                      "url": "https://cdn-origin.gelato-api-dashboard.ie.live.gelato.tech/docs/sample-print-files/logo.png"
                    },
                    {
                      "type":"back",
                      "url": "https://cdn-origin.gelato-api-dashboard.ie.live.gelato.tech/docs/sample-print-files/logo.png"
                    }
                  ],
                  "quantity": 1
              }
          ],
          "shipmentMethodUid": "express",
          "shippingAddress": {
              "companyName": "Example",
              "firstName": "Paul",
              "lastName": "Smith",
              "addressLine1": "451 Clarkson Ave",
              "addressLine2": "Brooklyn",
              "state": "NY",
              "city": "New York",
              "postCode": "11203",
              "country": "US",
              "email": "apisupport@gelato.com",
              "phone": "123456789"
          },
          "returnAddress": {
              "companyName": "My company",
              "addressLine1": "3333 Saint Marys Avenue",
              "addressLine2": "Brooklyn",
              "state": "NY",
              "city": "New York",
              "postCode": "13202",
              "country": "US",
              "email": "apisupport@gelato.com",
              "phone": "123456789"
          },
          "metadata": [
              {
                  "key":"keyIdentifier1",
                  "value":"keyValue1"
              },
              {
                  "key":"keyIdentifier2",
                  "value":"keyValue2"
              }
          ]
      }'
  ```

### 2. `should get order`
- **Issue:** `Cannot read properties of undefined (reading 'id')` because `createdOrder` is `undefined`.
- **Plan:**
  - Ensure `create()` returns a valid order object.
  - Add a check to skip this test if `createdOrder` is `undefined`.
  - Mock the `create()` response if the API is unreliable.
- **Correct URL:** `GET https://order.gelatoapis.com/v4/orders/{{orderId}}`
- **Example:**
  ```
  $ curl -X GET \
      https://order.gelatoapis.com/v4/orders/37365096-6628-4538-a9c2-fbf9892deb85 \
      -H 'Content-Type: application/json' \
      -H 'X-API-KEY: {{apiKey}}'
  ```

### 3. `should delete draft order`
- **Issue:** Same as above, `createdOrder` is `undefined`.
- **Plan:**
  - Same as `should get order`.
  - Ensure `delete()` is called with a valid `orderId`.
- **Correct URL:** `DELETE https://order.gelatoapis.com/v4/orders/{{orderId}}`
- **Example:**
  ```
  $ curl -X DELETE \
      https://order.gelatoapis.com/v4/orders/37365096-6628-4538-a9c2-fbf9892deb85 \
      -H 'Content-Type: application/json' \
      -H 'X-API-KEY: {{apiKey}}'
  ```

### 4. `should patch draft order to order`
- **Issue:** `API Error: No route found for "POST https://order.ie.live.gelato.tech/api/orders"`.
- **Plan:**
  - Same as `should create order`.
  - Ensure `patch()` is called with a valid `orderId` and payload.
- **Correct URL:** `PATCH https://order.gelatoapis.com/v4/orders/{{orderId}}`
- **Example:**
  ```
  $ curl -X PATCH \
     https://order.gelatoapis.com/v4/orders/37365096-6628-4538-a9c2-fbf9892deb85 \
     -H 'Content-Type: application/json' \
     -H 'X-API-KEY: {{apiKey}}' \
     -d '{
          "orderType": "order"
      }'
  ```

### 5. `should cancel order`
- **Issue:** Same as above, `createdOrder` is `undefined`.
- **Plan:**
  - Same as `should get order`.
  - Ensure `cancel()` is called with a valid `orderId`.
- **Correct URL:** `POST https://order.gelatoapis.com/v4/orders/{{orderId}}:cancel`
- **Example:**
  ```
  $ curl -X POST \
      https://order.gelatoapis.com/v4/orders/37365096-6628-4538-a9c2-fbf9892deb85:cancel \
      -H 'Content-Type: application/json' \
      -H 'X-API-KEY: {{apiKey}}'
  ```

### 6. `should search orders`
- **Issue:** `API Error: No route found for "POST https://order.ie.live.gelato.tech/api/orders:search"`.
- **Plan:**
  - Same as `should create order`.
  - Ensure `search()` is called with a valid payload.
- **Correct URL:** `POST https://order.gelatoapis.com/v4/orders:search`
- **Example:**
  ```
  $ curl -X POST \
      https://order.gelatoapis.com/v4/orders:search \
      -H 'Content-Type: application/json' \
      -H 'X-API-KEY: {{apiKey}}' \
      -d '{
           "orderTypes": [
               "draft",
               "order"
           ],
           "countries": [
               "US",
               "DE",
               "CA"
           ]
       }'
  ```

### 7. `should create quote`
- **Issue:** `API Error: No route found for "POST https://order.ie.live.gelato.tech/api/v3/orders/quote"`.
- **Plan:**
  - Verify the Orders API base URL is correct (`https://order.gelatoapis.com`).
  - Check for any legacy code or configuration overriding the base URL.
  - Mock the `createQuote()` response if the API is unreliable.
- **Correct URL:** `POST https://order.gelatoapis.com/v4/orders:quote`
- **Example:**
  ```
  $ curl -X POST \
      https://order.gelatoapis.com/v4/orders:quote \
      -H 'Content-Type: application/json' \
      -H 'X-API-KEY: {{apiKey}}' \
      -d '{
           "items": [
               {
                   "itemReferenceId": "{{myItemId1}}",
                   "productUid": "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_classic_gsi_s_gco_white_gpr_4-4",
                   "quantity": 1
               }
           ],
           "shipmentMethodUid": "express",
           "shippingAddress": {
               "companyName": "Example",
               "firstName": "Paul",
               "lastName": "Smith",
               "addressLine1": "451 Clarkson Ave",
               "addressLine2": "Brooklyn",
               "state": "NY",
               "city": "New York",
               "postCode": "11203",
               "country": "US",
               "email": "apisupport@gelato.com",
               "phone": "123456789"
           }
       }'
  ```

### 8. `should NOT delete non-draft order`
- **Issue:** Same as `should create order`.
- **Plan:**
  - Same as `should create order`.
  - Ensure `delete()` is called with a valid `orderId`.
- **Correct URL:** `DELETE https://order.gelatoapis.com/v4/orders/{{orderId}}`
- **Example:**
  ```
  $ curl -X DELETE \
      https://order.gelatoapis.com/v4/orders/37365096-6628-4538-a9c2-fbf9892deb85 \
      -H 'Content-Type: application/json' \
      -H 'X-API-KEY: {{apiKey}}'
  ```
