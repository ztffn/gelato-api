# Gelato API Client in JavaScript/TypeScript

<!-- ![Build Status]() -->

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)
[![npm version](https://badge.fury.io/js/gelato-api.svg)](https://badge.fury.io/js/gelato-api)

This library provides support for TypeScript/JavaScript [Gelato](https://www.gelato.com/)'s API. See full documentation on [Gelato API docs](https://dashboard.gelato.com/docs).

## Current Status & V4 API Integration

This SDK currently primarily targets Gelato's V3 API for most functionalities, particularly for Orders. 
We are actively working on:
- Investigating and integrating Gelato's V4 API endpoints.
- Enhancing unit test coverage across all modules.
- Finalizing ESLint configuration for improved code quality.

For detailed information on our progress, V4 transition plans, and specific API considerations (such as V4 equivalents for certain V3 methods), please refer to our [ROADMAP.md](ROADMAP.md) file.

## Install

```sh
# npm
npm i -S gelato-api

# yarn
yarn add gelato-api
```

## Usage

Before you can utilize the API you need:

1. An account on [Gelato.com](https://www.gelato.com/).
2. Create an API key in [Dashboard > Developer > API Keys](https://dashboard.gelato.com/keys/manage)

```ts
import { GelatoApi } from 'gelato-api';
// Note: Specific type imports might be needed from 'gelato-api/dist/types' if using named types
// e.g. import { OrderCreateRequest } from 'gelato-api/dist/types';

const gelato = new GelatoApi({ apiKey: 'YOUR-API-KEY' });
```

### Examples

#### Catalogs & Products

(These examples use the product API, which has some methods on older versions like v1, see `src/products/products.ts` for details. V4 product API integration is planned.)

```ts
// Get all catalogs
const allCatalogs = await gelato.products.getCatalogs();

// Get specific catalog
const cardCatalog = await gelato.products.getCatalog('cards'); // Example catalog UID

// Get/Search products in catalog
const cardProducts = await gelato.products.getProductsInCatalog('cards', { limit: 5 });

// Get specific product
const card1 = await gelato.products.getProduct('cards_pf_bb_pt_350...'); // Example product UID

// Get cover dimensions
const dims = await gelato.products.getCoverDimensions('photobooks-softcover_pf_140x...', { // Example product UID
  pageCount: 30,
});

// Get prices
const cardPrices = await gelato.products.getPrices('cards_pf_bb_pt_350...', { // Example product UID
  country: 'SE',
  currency: 'SEK',
});

// Get stock availability
const stockInfo = await gelato.products.getStockAvailability([
  'cards_pf_bb_pt_350...',
  'photobooks-softcover_pf_140x140...',
]);
```

#### Shipment Methods

(This uses the V1 shipping methods endpoint.)
```ts
// Get available shipment methods in Sweden
const shipments = await gelato.shipment.getMethods({ country: 'SE' });
```

#### Orders

(These examples use the V3 Orders API.)
```ts
import { OrderCreateRequest } from 'gelato-api/dist/types'; // Example direct type import

// Create order
const myOrder: OrderCreateRequest = { // Using imported type
  orderType: 'draft',
  orderReferenceId: 'my-internal-order-id',
  customerReferenceId: 'my-internal-customer-id',
  currency: 'EUR',
  items: [
    {
      itemReferenceId: 'my-internal-item-id',
      productUid: 'cards_pf_bb_pt_350-gsm-coated-silk_cl_4-4_hor', // Example product UID
      quantity: 1,
      fileUrl: 'https://example.com/path/to/your/file.pdf', // Replace with a valid URL
    },
  ],
  shippingAddress: {
    firstName: 'Test',
    lastName: 'Testson',
    addressLine1: 'Test Street 123',
    city: 'Testville',
    postCode: '123 45',
    country: 'SE',
    email: 'test@example.com',
  },
};
const createdOrder = await gelato.orders.v3.create(myOrder);

// And more...
const anOrder = await gelato.orders.v3.get('gelato-order-id'); // Replace with actual order ID
const foundOrders = await gelato.orders.v3.search({ customerReferenceId: 'my-internal-customer-id' });

const patchedOrder = await gelato.orders.v3.patchDraft('gelato-draft-order-id', [{ op: 'replace', path: '/customerReferenceId', value: 'new-customer-ref' }]);
// Note: For full order updates on confirmed orders, V4 API considerations apply. See ROADMAP.md.
const updatedOrder = await gelato.orders.v3.update('gelato-order-id', { /* ... partial order data ... */ });

await gelato.orders.v3.deleteDraft('gelato-draft-order-id');
await gelato.orders.v3.cancel('gelato-order-id');

const quoteResponse = await gelato.orders.v3.quote({ /* ... quote request data ... */ });
const shippingAddress = await gelato.orders.v3.getShippingAddress('gelato-order-id');
// Note: For updating shipping addresses, V4 API considerations apply (e.g., PATCH method). See ROADMAP.md.
const updatedShippingAddress = await gelato.orders.v3.updateShippingAddress('gelato-order-id', { /* ... new address data ... */ });
```

> **_NOTE_**
> Orders V2 is not supported. The focus is on V3 and future V4 integration.

## Run end-to-end tests

The E2E tests will utilize each feature supported, meaning it will list, create, update and delete actual data in the API. However, when it runs successfully it should have cleaned up any test orders. If not - it might be worth to take a look in the [Dashboard > Orders](https://dashboard.gelato.com/orders/list) to see if any manual clean up is required.

To run the e2e tests, follow these steps:

1. Rename `.env-SAMPLE` to `.env` and add your Gelato API key.
2. Run tests:
   ```sh
   npm run test:e2e
   # or
   yarn test:e2e
   ```

## Project Roadmap

For more details on the project's current status, planned improvements, and V4 API integration efforts, please see our [ROADMAP.md](ROADMAP.md) file.

## Go nuts! 🥳
