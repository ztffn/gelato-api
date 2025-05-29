import { GelatoApi } from '../src/gelato-api';
import {
  ProductCatalog,
  ProductCoverDimension,
  OrderCreateRequest,
  Order,
  OrderShippingAddress,
  OrderPatchRequest,
  ShipmentMethod,
  OrderQuoteRequest,
  OrderSearchListResponse,
  OrderQuoteResponse
} from '../src/types';

require('dotenv').config(); // utilize .env file
const apiKey = process.env.GELATO_API_KEY;

if (!apiKey) {
  throw 'No environment variable for GELATO_API_KEY defined';
}

const prodUids: string[] = []; // <-- moved to top-level scope

describe('GelatoApi End-To-End', () => {
  const api = new GelatoApi({ apiKey });

  it('should throw error on invalid api key', async () => {
    const apiFaulty = new GelatoApi({ apiKey: 'faulty-token' });
    expect(apiFaulty.products.getCatalogs()).rejects.toBeTruthy();
  });

  describe('Product', () => {
    let cats1: ProductCatalog[];

    it('should get catalogs', async () => {
      const cats1 = await api.products.getCatalogs();
      expect(cats1).toBeDefined();
      expect(Array.isArray(cats1)).toBe(true);
      expect(cats1.length).toBeGreaterThan(0);
    });

    it('should get specific catalog', async () => {
      const cats1 = await api.products.getCatalogs();
      expect(cats1).toBeDefined();
      expect(Array.isArray(cats1)).toBe(true);
      expect(cats1.length).toBeGreaterThan(0);
      const cat1 = await api.products.getCatalog(cats1[0].catalogUid);
      expect(cat1).toBeDefined();
      expect(cat1.catalogUid).toBe(cats1[0].catalogUid);
    });

    it('should get products in specific catalog', async () => {
      const cats1 = await api.products.getCatalogs();
      expect(cats1).toBeDefined();
      expect(Array.isArray(cats1)).toBe(true);
      expect(cats1.length).toBeGreaterThan(0);
      const products = await api.products.getProductsInCatalog(cats1[0].catalogUid, {
        attributeFilters: {
          Orientation: ['hor', 'ver'],
          CoatingType: ['none']
        },
        limit: 50,
        offset: 0
      });
      expect(products).toBeDefined();
      expect(Array.isArray(products.products)).toBe(true);
      expect(products.products.length).toBeGreaterThan(0);
    });

    it('should get specific product', async () => {
      const cats1 = await api.products.getCatalogs();
      expect(cats1).toBeDefined();
      expect(Array.isArray(cats1)).toBe(true);
      expect(cats1.length).toBeGreaterThan(0);
      const products = await api.products.getProductsInCatalog(cats1[0].catalogUid, {
        attributeFilters: {
          Orientation: ['hor', 'ver'],
          CoatingType: ['none']
        },
        limit: 50,
        offset: 0
      });
      expect(products).toBeDefined();
      expect(Array.isArray(products.products)).toBe(true);
      expect(products.products.length).toBeGreaterThan(0);
      const product = await api.products.getProduct(products.products[0].productUid);
      expect(product).toBeDefined();
      expect(product.productUid).toBe(products.products[0].productUid);
    });

    it('should get cover dimensions for specific product', async () => {
      const id = 'photobooks-hardcover_pf_210x280-mm-8x11-inch_pt_170-gsm-65lb-coated-silk_cl_4-4_ccl_4-4_bt_glued-left_ct_matt-lamination_prt_1-0_cpt_130-gsm-65-lb-cover-coated-silk_ver';
      const cdResult = await api.products.getCoverDimensions(id, 100);
      expect(cdResult).toBeDefined();
      expect(cdResult.productUid).toBe(id);
      expect(cdResult.pagesCount).toBeDefined();
    });

    it('should get prices for specific product', async () => {
      const cats1 = await api.products.getCatalogs();
      expect(cats1).toBeDefined();
      expect(Array.isArray(cats1)).toBe(true);
      expect(cats1.length).toBeGreaterThan(0);
      const products = await api.products.getProductsInCatalog(cats1[0].catalogUid, {
        attributeFilters: {
          Orientation: ['hor', 'ver'],
          CoatingType: ['none']
        },
        limit: 50,
        offset: 0
      });
      expect(products).toBeDefined();
      expect(Array.isArray(products.products)).toBe(true);
      expect(products.products.length).toBeGreaterThan(0);
      const prices = await api.products.getPrice(products.products[0].productUid);
      expect(prices).toBeDefined();
      expect(Array.isArray(prices)).toBe(true);
      expect(prices.length).toBeGreaterThan(0);
    });

    it('should get stock availability for specific products', async () => {
      const cats1 = await api.products.getCatalogs();
      expect(cats1).toBeDefined();
      expect(Array.isArray(cats1)).toBe(true);
      expect(cats1.length).toBeGreaterThan(0);
      const products = await api.products.getProductsInCatalog(cats1[0].catalogUid, {
        attributeFilters: {
          Orientation: ['hor', 'ver'],
          CoatingType: ['none']
        },
        limit: 50,
        offset: 0
      });
      expect(products).toBeDefined();
      expect(Array.isArray(products.products)).toBe(true);
      expect(products.products.length).toBeGreaterThan(0);
      const availability = await api.products.getStockAvailability([products.products[0].productUid]);
      expect(availability).toBeDefined();
      expect(Array.isArray(availability)).toBe(true);
      expect(availability.length).toBeGreaterThan(0);
    });
  });

  describe('Shipment', () => {
    it('should get shipment methods', async () => {
      const methods = await api.shipment.getMethods();
      expect(methods.length).toBeGreaterThan(0);
      expect(methods[0]?.shipmentMethodUid).toBeDefined();
      expect(methods[0]?.name).toBeDefined();
      expect(['normal', 'express', 'pallet']).toContain(methods[0]?.type);
      expect(Array.isArray(methods[0]?.supportedCountries)).toBe(true);
    });
  });

  describe('Orders', () => {
    const testOrder: OrderCreateRequest = {
      orderType: 'draft',
      orderReferenceId: 'DUMMY-ORDER-FOR-E2E-TEST',
      customerReferenceId: 'DUMMY-CUSTOMER-FOR-E2E-TEST',
      currency: 'EUR',
      items: [
        {
          itemReferenceId: 'DUMMY-ITEM-FOR-E2E-TEST',
          productUid: 'cards_pf_bb_pt_350-gsm-coated-silk_cl_4-4_hor',
          files: [
            {
              type: 'default',
              url: 'https://cdn-origin.gelato-api-dashboard.ie.live.gelato.tech/docs/sample-print-files/logo.png'
            }
          ],
          quantity: 1
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
        phone: '123456789'
      },
    };
    let createdOrder: Order;

    // Add a beforeAll to ensure prodUids is populated before running quote test
    beforeAll(async () => {
      if (prodUids.length === 0) {
        // Fetch catalogs and products if not already done
        const catalogs = await api.products.getCatalogs();
        if (catalogs.length > 0) {
          const productsResp = await api.products.getProductsInCatalog(catalogs[0].catalogUid, {});
          productsResp.products.forEach((p) => prodUids.push(p.productUid));
        }
      }
    });

    it('should create order', async () => {
      const o = await api.orders.create(testOrder);
      const testOrderProps = ['orderType', 'orderReferenceId', 'customerReferenceId', 'currency'];
      const testShippingProps = Object.keys(testOrder.shippingAddress) as Array<keyof OrderShippingAddress>;

      expect(o?.id).toBeDefined();
      testOrderProps.forEach((p) =>
        expect(o[p as keyof OrderCreateRequest]).toBe(testOrder[p as keyof OrderCreateRequest]),
      );
      testShippingProps.forEach((p) => expect(o.shippingAddress[p]).toBe(testOrder.shippingAddress[p]));

      expect(o.items.length).toBe(testOrder.items.length);
      expect(o.items[0].files).toBeDefined();
      expect(o.items[0].files[0].type).toBe('default');
      expect(o.items[0].files[0].url).toBeDefined();
      expect(o.channel).toBeDefined();
      expect(o.receipts).toBeDefined();

      await expect(
        api.orders.create({ myInvalid: 'dummy-order' } as unknown as OrderCreateRequest),
      ).rejects.toThrow();

      createdOrder = o;
    });

    it('should get order', async () => {
      const fetchedOrder = await api.orders.get(createdOrder.id);
      expect(fetchedOrder.id).toBe(createdOrder.id);
    });

    it('should delete draft order', async () => {
      let orderToPatchToDraft = await api.orders.get(createdOrder.id);
      if (orderToPatchToDraft.orderType === 'order') {
        orderToPatchToDraft = await api.orders.patch(createdOrder.id, { orderType: 'draft' } as any);
      }

      await expect(api.orders.delete(createdOrder.id)).resolves.not.toThrow();
      await expect(api.orders.delete('INVALID-ORDER-ID')).rejects.toThrow();
    });

    it('should patch draft order to order', async () => {
      // Increase timeout to 15 seconds as the patch operation involves multiple steps:
      // - Processing the order
      // - Calculating prices
      // - Generating receipts
      // - Setting up shipping
      // - Updating order status
      jest.setTimeout(15000);

      createdOrder = await api.orders.create(testOrder);

      const patchedOrder = await api.orders.patch(createdOrder.id, {
        orderType: 'order',
      });
      expect(patchedOrder).toBeDefined();
      expect(patchedOrder.orderType).toBe('order');
      expect(patchedOrder.orderReferenceId).toBe(testOrder.orderReferenceId);

      await expect(api.orders.patch('INVALID-ORDER-ID', { orderType: 'order' })).rejects.toThrow();
    });

    it('should cancel order', async () => {
      await expect(api.orders.cancel(createdOrder.id)).resolves.not.toThrow();
      await expect(api.orders.cancel('INVALID-ORDER-ID')).rejects.toThrow();
    });

    it('should search orders', async () => {
      const orders = await api.orders.search({});
      expect(orders).toBeDefined();
      expect(orders.length).toBeGreaterThan(0);
    });

    it('should create quote', async () => {
      const testQuote: OrderQuoteRequest = {
        orderReferenceId: 'DUMMY-ORDER-QUOTE',
        customerReferenceId: 'DUMMY-CUSTOMER-QUOTE',
        currency: 'USD',
        recipient: {
          firstName: 'John',
          lastName: 'Doe',
          addressLine1: '123 Main St',
          city: 'New York',
          postCode: '10001',
          country: 'US',
          email: 'test@example.com',
        },
        products: [
          {
            itemReferenceId: 'DUMMY-ITEM-FOR-QUOTE-TEST',
            productUid: prodUids[0],
            quantity: 1,
            files: [
              {
                type: 'default',
                url: 'https://cdn-origin.gelato-api-dashboard.ie.live.gelato.tech/docs/sample-print-files/logo.png'
              }
            ]
          }
        ]
      };
      const qResponse = await api.orders.quote(testQuote);
      expect(qResponse).toBeDefined();
    });

    it('should NOT delete non-draft order (if previously cancelled, re-create as draft)', async () => {
      const draftOrderToTestDelete = await api.orders.create(testOrder);
      await api.orders.patch(draftOrderToTestDelete.id, { orderType: 'order' });
      await expect(api.orders.delete(draftOrderToTestDelete.id)).rejects.toThrow();
    });
  });
});
