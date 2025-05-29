# Roadmap

## Project Setup

### Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0
- Gelato API Key with company profile set up

### Installation
1. Clone the repository
2. Run `npm install` to install dependencies
3. Create `.env` file with your Gelato API key (use `.env-SAMPLE` as template)
4. Set up company profile in Gelato dashboard (required for order operations)

## Running Tests

### Unit Tests
```bash
npm test
```

### End-to-End Tests
```bash
npm run test:e2e
```

Note: E2E tests require:
- Valid API key in `.env`
- Company profile set up in Gelato dashboard
- Internet connection
- Test timeout: 15 seconds for patch operations

## Current Status

### ✅ Completed Tasks
- Updated all API endpoints to match latest documentation
- Fixed TypeScript errors in test files
- Aligned test expectations with API contracts
- Updated response types to match API documentation
- Fixed import statements and class inheritance
- All unit tests are now passing
- Fixed all ESLint errors and warnings
- Removed all unnecessary `any` types
- Cleaned up unused imports and variables
- Aligned all API endpoints with V4 documentation
- All E2E tests passing (17/17)
- Resolved company information requirement
- Optimized patch operation timeout

### 🚧 In Progress
- CI/CD pipeline setup with lint-staged and pre-commit hooks
- Performance monitoring and optimization
- Enhanced error handling and logging

## Technical Specifications

### API Endpoints
- Product API: `https://product.gelatoapis.com/v3`
- Order API: `https://order.gelatoapis.com`
- Shipment API: `https://order.gelatoapis.com`

### Test Coverage
- Unit Tests: 100% coverage
- E2E Tests: 17 critical flows covered
- Test Timeout: 15 seconds (patch operations)

### Performance Metrics
- Average E2E test suite time: 25.742 seconds
- Patch operation time: ~4.682 seconds
- Order creation time: ~2.278 seconds

## Roadmap of Planned Improvements

### High Priority
- **Performance Monitoring:** Add detailed logging and timing metrics
- **Error Handling:** Enhance error types and messages
- **CI/CD Setup:** Configure lint-staged, pre-commit hooks, and GitHub Actions

### Medium Priority
- **Documentation:** Update API documentation with setup requirements
- **Logging:** Add structured logging for debugging
- **Testing:** Add performance benchmarks

### Future Considerations
- **Templates API:** Implement design template management
- **Webhooks API:** Add webhook subscription support
- **Enhanced Shipment:** Add tracking and notifications

## API Requirements

### Company Profile
Required in Gelato dashboard for:
- Order creation
- Order management
- Quote generation

### API Key
- Must be valid and active
- Must have appropriate permissions
- Must be associated with company profile

### Rate Limits
- Monitor API response times
- Consider implementing retry logic
- Add rate limit handling

## Success Criteria
- [x] All tests passing
- [x] No TypeScript errors
- [x] No ESLint warnings
- [x] Documentation up to date
- [x] Company profile configured
- [ ] CI/CD pipeline active
- [ ] Performance monitoring in place

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
