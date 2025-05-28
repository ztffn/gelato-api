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

describe('GelatoApi End-To-End', () => {
  const api = new GelatoApi({ apiKey });

  it('should throw error on invalid api key', async () => {
    const apiFaulty = new GelatoApi({ apiKey: 'faulty-token' });
    expect(apiFaulty.products.getCatalogs()).rejects.toBeTruthy();
  });

  describe('Product', () => {
    let cats1: ProductCatalog[];
    const prodUids: string[] = [];

    it('should get catalogs', async () => {
      const result = await api.products.getCatalogs();
      cats1 = result.data;
      expect(cats1?.length).toBeGreaterThan(0);
    });

    it('should get specific catalog', async () => {
      const cat1Catalog = cats1[0];
      const cat = await api.products.getCatalog(cat1Catalog.catalogUid);
      expect(cat.catalogUid).toBe(cat1Catalog.catalogUid);
      expect(cat.title).toBe(cat1Catalog.title);
    });

    it('should get products in specific catalog', async () => {
      const cat1Catalog = cats1[0];
      const s1 = await api.products.getProductsInCatalog(cat1Catalog.catalogUid);
      const s2 = await api.products.getProductsInCatalog(cat1Catalog.catalogUid, { limit: 1, offset: 1 });
      const s3 = await api.products.getProductsInCatalog(cat1Catalog.catalogUid, {
        attributeFilters: { DummyAttr: ['that', 'doesnt', 'exists'] },
      });
      expect(s1.products?.length).toBeGreaterThan(0);
      expect(s2.products?.length).toBeLessThan(s1.products.length);
      expect(s2.products?.length).toBe(1);
      expect(s3.products?.length).toBe(0);

      s1.products.forEach((p) => prodUids.push(p.productUid));
    });

    it('should get specific product', async () => {
      const prod = await api.products.getProduct(prodUids[0]);
      expect(prod).toBeDefined();
      expect(prod.productUid).toBeDefined();
    });

    it('should get cover dimensions for specific product', async () => {
      const id =
        'photobooks-hardcover_pf_210x280-mm-8x11-inch_pt_170-gsm-65lb-coated-silk_cl_4-4_ccl_4-4_bt_glued-left_ct_matt-lamination_prt_1-0_cpt_130-gsm-65-lb-cover-coated-silk_ver';
      const cdResult = await api.products.getCoverDimensions(id, { pageCount: 100 });
      const cd = Array.isArray(cdResult) ? cdResult[0] : (cdResult.products ? cdResult.products[0] : cdResult);
      expect(cd).toBeDefined();
      expect(cd.productUid).toBe(id);
      expect(cd.pageCount).toBeDefined();
    });

    it('should get prices for specific product', async () => {
      const prices1 = await api.products.getPrices(prodUids[0]);
      const prices2 = await api.products.getPrices(prodUids[0], { country: 'SE', currency: 'SEK' });
      expect(Array.isArray(prices1)).toBe(true);
      expect(Array.isArray(prices2)).toBe(true);
      expect(prices1.length).toBeGreaterThan(0);
      expect(prices2.length).toBeGreaterThan(0);
      expect(prices1[0].productUid).toBe(prices2[0].productUid);
      expect(prices1[0].country).not.toBe(prices2[0].country);
      expect(prices1[0].currency).not.toBe(prices2[0].currency);
    });

    it('should get stock availability for specific products', async () => {
      const productUids = prodUids.slice(0, 3);
      const stock = await api.products.getStockAvailability(productUids);
      expect(productUids.length).toBe(3);
      expect(stock?.productsAvailability.length).toBe(3);
      expect(stock?.productsAvailability[0].availability.length).toBeGreaterThan(0);
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
      const searchResult = await api.orders.search({ ids: [createdOrder.id] });
      expect(searchResult.data.length).toBe(1);
      const s1 = await api.orders.search({ orderReferenceIds: [testOrder.orderReferenceId] });
      expect(s1.data.length).toBeGreaterThan(0);
      const s2 = await api.orders.search({ search: 'Testson' });
      expect(s2.data.length).toBeGreaterThan(0);
      const s3 = await api.orders.search({ countries: [testOrder.shippingAddress.country] });
      expect(s3.data.length).toBeGreaterThan(0);
      const s4 = await api.orders.search({ orderReferenceId: 'INVALID-ORDER-REF-ID-FOR-SEARCH' });
      expect(s4.data.length).toBe(0);
    });

    it('should quote order', async () => {
      const testQuote: OrderQuoteRequest = {
        orderReferenceId: 'DUMMY-ORDER-QUOTE',
        customerReferenceId: 'DUMMY-CUSTOMER-QUOTE',
        currency: 'EUR',
        recipient: {
          firstName: 'Test',
          lastName: 'Testson',
          addressLine1: 'Test Street 123',
          city: 'Testville',
          postCode: '123 45',
          country: 'SE',
          email: 'test@example.com',
        },
        products: [
          {
            itemReferenceId: 'DUMMY-ITEM-FOR-QUOTE-TEST',
            productUid: 'cards_pf_bb_pt_350-gsm-coated-silk_cl_4-4_hor',
            quantity: 1,
            files: [
              {
                type: 'default',
                url: 'https://cdn-origin.gelato-api-dashboard.ie.live.gelato.tech/docs/sample-print-files/logo.png'
              }
            ]
          },
        ],
      };
      const qResponse = await api.orders.quote(testQuote);
      expect(qResponse).toBeDefined();
      expect(qResponse.id).toBeDefined();
      expect(Array.isArray(qResponse.products)).toBe(true);
      expect(qResponse.products.length).toBeGreaterThan(0);
    });

    it('should NOT delete non-draft order (if previously cancelled, re-create as draft)', async () => {
      const draftOrderToTestDelete = await api.orders.create(testOrder);
      await api.orders.patch(draftOrderToTestDelete.id, { orderType: 'order' });
      await api.orders.cancel(draftOrderToTestDelete.id);
      await api.orders.patch(draftOrderToTestDelete.id, { orderType: 'draft' } as any);
      await api.orders.delete(draftOrderToTestDelete.id);
    });

    it('should patch order back to draft', async () => {
      const orderForPatchToDraft = await api.orders.create(testOrder);
      await api.orders.patch(orderForPatchToDraft.id, { orderType: 'order' });
      const patchedToDraft = await api.orders.patch(orderForPatchToDraft.id, { orderType: 'draft' } as any);
      expect(patchedToDraft.orderType).toBe('draft');
      await api.orders.delete(orderForPatchToDraft.id);
    });

    it('should get order and check shipping address (formerly getShippingAddress)', async () => {
      const orderForShippingCheck = await api.orders.create(testOrder);
      const fetchedOrder = await api.orders.get(orderForShippingCheck.id);

      const sa = fetchedOrder.shippingAddress;
      const testOrderShippingAddress = testOrder.shippingAddress as OrderShippingAddress;
      const testProps = Object.keys(testOrderShippingAddress) as Array<keyof OrderShippingAddress>;

      testProps.forEach((p) => expect(sa[p]).toEqual(testOrderShippingAddress[p]));
      await api.orders.delete(orderForShippingCheck.id);
    });

    it('should clean up any remaining test order', async () => {
      try {
        if (createdOrder && createdOrder.id) {
          let finalOrderState = await api.orders.get(createdOrder.id);
          if (finalOrderState.orderType === 'draft') {
            await api.orders.delete(finalOrderState.id);
          } else if (finalOrderState.orderType === 'order' && finalOrderState.fulfillmentStatus !== 'canceled') {
            await api.orders.cancel(finalOrderState.id);
            finalOrderState = await api.orders.patch(finalOrderState.id, { orderType: 'draft' } as any);
            await api.orders.delete(finalOrderState.id);
          } else if (finalOrderState.orderType === 'order' && finalOrderState.fulfillmentStatus === 'canceled') {
            finalOrderState = await api.orders.patch(finalOrderState.id, { orderType: 'draft' } as any);
            await api.orders.delete(finalOrderState.id);
          }
        }
      } catch (error) {
        // Ignore errors if order doesn't exist, it's already cleaned up.
      }
    });
  });
});
