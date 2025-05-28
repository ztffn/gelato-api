# Roadmap

## Project Setup

To set up the project, clone the repository and run `npm install` to install the dependencies.
You will also need to create a `.env` file with your Gelato API key. You can use `.env-SAMPLE` as a template.

## Running Tests

Unit tests can be run with `npm test`.
End-to-end tests can be run with `npm run test:e2e`. Make sure your `.env` file is configured before running e2e tests.

## Current Status

### ✅ Completed Tasks
- Updated all API endpoints to match latest documentation
- Fixed TypeScript errors in test files
- Aligned test expectations with API contracts
- Updated response types to match API documentation
- Fixed import statements and class inheritance
- All unit tests are now passing

### 🚧 In Progress
- ESLint configuration update to v8.57+ or v9+
- End-to-end test implementation

## Roadmap of Planned Improvements

### High Priority
- **Update ESLint Configuration:** Update ESLint to v8.57+ or v9+, finalize configuration, and apply fixes.
- **Implement End-to-End Tests:** Create comprehensive e2e tests for all API endpoints.
- **Enhance Error Handling:** Improve error handling in `GelatoApiBase` (`src/base.ts`) with specific error types and logging.

### Medium Priority
- **Review V4 API Coverage:** Compare the SDK with full V4 documentation for Orders & Products.
- **Update SDK Documentation:** Update `README.md` and code comments to reflect API V4 changes and other improvements.
- **Investigate V4 Equivalents:** Research and document V4 equivalents for removed Order methods.

### Future Considerations
- **Templates API Integration:** If available in V4, implement support for design template management.
- **Webhooks API:** Add support for managing webhook subscriptions for various events.
- **Enhanced Shipment Features:** Implement additional shipment tracking and management features if available in V4.

## V4 API Equivalents for Order Methods

Based on investigation of V4 API documentation:

### Full Order Update
The V3 method `update(orderId, order)` for full order updates does not have a direct equivalent in V4 for confirmed orders. V4 favors more granular updates. Modifying an existing order's items or other fundamental details after confirmation might require:
1. Cancelling the existing order (if possible within the allowed timeframe).
2. Creating a new order with the desired changes.

Partial updates to specific, mutable order attributes (e.g., metadata) are available via `PATCH` requests to the main order endpoint (`PATCH /orders/{orderId}`).

### Shipping Address Modification
The V3 methods for managing shipping addresses have V4 equivalents:

- **Get Shipping Address:** `GET /orders/{orderId}/shipping-address`
- **Update Shipping Address:** `PATCH /orders/{orderId}/shipping-address`

Key Change: The update operation uses `PATCH` instead of `PUT`, allowing partial updates. This is typically allowed only before the order is sent for fulfillment.

## Potential for Full V4 API Coverage

### Orders API (V4)
* **New Features:**
  * Real-time Order Status via WebSocket
  * Granular Item Management
  * Enhanced Metadata/Tags
  * Payment Integration Details
* **Status:** Partially implemented. Core functionality is in place, but new V4 features need to be added.

### Products API (V4)
* **New Features:**
  * Enhanced Customization & Variants
  * Dynamic & Contextual Pricing
  * Digital Products Support
  * Sustainability Information
* **Status:** Basic functionality implemented. Need to update to latest V4 endpoints and features.

### Templates API (V4)
* **Functionality:**
  * CRUD operations for design templates
  * Template association with products
  * Template application to order items
* **Status:** Not implemented. Would be a new module in the SDK.

### Other Potential V4 APIs
* **Shipment API (V4):** Basic functionality implemented. Could be expanded with tracking and notifications.
* **User/Account Management API (V4):** Not implemented. Could be added if available.
* **Webhooks API (V4):** Not implemented. Would be valuable for integration.

A full V4 migration would be a significant undertaking but would ensure the SDK remains current and provides access to the latest platform capabilities. Each new API or version upgrade should be treated as a distinct feature set to be implemented and tested.
