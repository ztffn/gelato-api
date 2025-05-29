# Gelato API SDK

TypeScript SDK for the Gelato API, providing a type-safe interface to Gelato's print-on-demand services.

## Features

- Full TypeScript support
- Comprehensive API coverage:
  - Products API (V3)
  - Orders API (V4)
  - Shipment API (V4)
- End-to-end test coverage
- ESLint and Prettier integration

## Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- Gelato API Key with company profile set up

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/gelato-api.git
   cd gelato-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env-SAMPLE .env
   ```
   Edit `.env` and add your Gelato API key.

4. Set up company profile in Gelato dashboard (required for order operations)

## Usage

```typescript
import { GelatoApi } from './src/gelato-api';

const api = new GelatoApi({ apiKey: 'your-api-key' });

// Get product catalogs
const catalogs = await api.products.getCatalogs();

// Create an order
const order = await api.orders.create({
  orderType: 'draft',
  orderReferenceId: 'my-order-123',
  items: [
    {
      productUid: 'product-uid',
      quantity: 1,
      files: [
        {
          type: 'default',
          url: 'https://example.com/design.png'
        }
      ]
    }
  ],
  shippingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    addressLine1: '123 Main St',
    city: 'New York',
    postCode: '10001',
    country: 'US',
    email: 'john@example.com'
  }
});
```

## Testing

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

## API Endpoints

- Product API: `https://product.gelatoapis.com/v3`
- Order API: `https://order.gelatoapis.com`
- Shipment API: `https://order.gelatoapis.com`

## Performance

- Average E2E test suite time: 25.742 seconds
- Patch operation time: ~4.682 seconds
- Order creation time: ~2.278 seconds

## Requirements

### Company Profile
Required in Gelato dashboard for:
- Order creation
- Order management
- Quote generation

### API Key
- Must be valid and active
- Must have appropriate permissions
- Must be associated with company profile

## Development

### Code Style
- ESLint for code quality
- Prettier for formatting
- TypeScript for type safety

### Testing
- Jest for unit tests
- 17 E2E test cases
- 100% test coverage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

MIT
