import { GelatoApi } from '../src/gelato-api';
import { Gelato as I } from '../src/types';

require('dotenv').config(); // utilize .env file
const apiKey = process.env.GELATO_API_KEY;

if (!apiKey) {
  throw 'No environment variable for GELATO_API_KEY defined';
}

describe('GelatoApi End-To-End', () => {
  const api = new GelatoApi({ apiKey });

  it('should throw error on invalid api key', async () => {
    const apiFaulty = new GelatoApi({ apiKey: 'faulty-token' });
    // getCatalogs no longer takes params, so we test it without.
    expect(apiFaulty.products.getCatalogs()).rejects.toBeTruthy();
  });

  describe('Product', () => {
    let cats1: I.ProductCatalog[]; // Updated type I.ListResponse<I.ProductCatalog> to I.ProductCatalog[]
    const prodUids: string[] = [];

    it('should get catalogs', async () => {
      cats1 = await api.products.getCatalogs();
      expect(cats1?.length).toBeGreaterThan(0); // Adjusted for direct array
    });

    // Removed the test 'should get catalogs with limit/offset params'
    // as getCatalogs() no longer accepts these parameters.

    it('should get specific catalog', async () => {
      const cat1Catalog = cats1[0]; // Adjusted for direct array
      const cat = await api.products.getCatalog(cat1Catalog.catalogUid);
      expect(cat.catalogUid).toBe(cat1Catalog.catalogUid);
      expect(cat.title).toBe(cat1Catalog.title);
    });

    it('should get products in specific catalog', async () => {
      const cat1Catalog = cats1[0]; // Adjusted for direct array
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
      // getCoverDimensions now returns I.ProductCoverDimension directly
      const cd = await api.products.getCoverDimensions(id, { pageCount: 100 });
      expect(cd).toBeDefined();
      expect(cd.productUid).toBe(id); // Basic check on the returned object
      expect(cd.pagesCount).toBeDefined(); // Check pagesCount (was pageCount in type)
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
      const r = await api.shipment.getMethods();
      expect(r?.shipmentMethods?.length).toBeGreaterThan(0);
      expect(r?.shipmentMethods[0]?.shipmentMethodUid).toBeDefined();
      expect(r?.shipmentMethods[0]?.name).toBeDefined();
      expect(['normal', 'express', 'pallet']).toContain(r?.shipmentMethods[0]?.type);
      expect(Array.isArray(r?.shipmentMethods[0]?.supportedCountries)).toBe(true);
    });
  });

  describe('Orders', () => {
    // Updated testOrder for V4: files instead of fileUrl
    const testOrder: I.OrderCreateRequest = {
      orderType: 'draft',
      orderReferenceId: 'DUMMY-ORDER-FOR-E2E-TEST', // Unique to avoid collision
      customerReferenceId: 'DUMMY-CUSTOMER-FOR-E2E-TEST',
      currency: 'EUR',
      items: [
        {
          itemReferenceId: 'DUMMY-ITEM-FOR-E2E-TEST',
          productUid: 'cards_pf_bb_pt_350-gsm-coated-silk_cl_4-4_hor',
          quantity: 1,
          files: [{ type: 'default', url: 'https://i1.sndcdn.com/artworks-000398776953-cwfbd0-t500x500.jpg' }],
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
    let createdOrder: I.Order;

    it('should create order', async () => {
      // Using api.orders directly (no .v3)
      const o = await api.orders.create(testOrder);
      const testOrderProps = ['orderType', 'orderReferenceId', 'customerReferenceId', 'currency'];
      const testShippingProps = Object.keys(testOrder.shippingAddress) as Array<keyof I.OrderShippingAddress>;

      expect(o?.id).toBeDefined();
      testOrderProps.forEach((p) =>
        expect(o[p as keyof I.OrderCreateRequest]).toBe(testOrder[p as keyof I.OrderCreateRequest]),
      );
      testShippingProps.forEach((p) => expect(o.shippingAddress[p]).toBe(testOrder.shippingAddress[p]));

      expect(o.items.length).toBe(testOrder.items.length);
      // V4 specific checks
      expect(o.channel).toBeDefined(); // 'channel' is a new mandatory field in V4 Order response
      expect(o.receipts).toBeDefined(); // 'receipts' is a new mandatory field in V4 Order response (was optional/not always there)
      // billingEntity is optional in V4, so not asserting its presence by default.
      // shipment is optional in V4 (especially for drafts), so not asserting its presence by default.

      await expect(
        api.orders.create({ myInvalid: 'dummy-order' } as unknown as I.OrderCreateRequest),
      ).rejects.toThrow();

      createdOrder = o;
    });

    it('should get order', async () => {
      const fetchedOrder = await api.orders.get(createdOrder.id);
      expect(fetchedOrder.id).toBe(createdOrder.id);
      // Add more assertions based on V4 I.Order if necessary, e.g. file structure
      expect(fetchedOrder.items[0].files).toEqual(testOrder.items[0].files);

      await expect(api.orders.get('INVALID-ORDER-ID')).rejects.toThrow();
    });

    // "should update order" test commented out as general update is not in V4.
    // Patch is for specific cases like converting draft to order or updating files.
    // it('should update order', async () => {
    //   const updatedOrder = await api.orders.update({ ...createdOrder, customerReferenceId: 'CUSTOMER-REF-CHANGED' });
    //   expect(updatedOrder.customerReferenceId).toBe('CUSTOMER-REF-CHANGED');
    //   await expect(api.orders.update({} as I.Order)).rejects.toThrow();
    // });

    it('should delete draft order', async () => {
      // Ensure order is draft if it was patched to 'order' in a previous failed run or similar
      let orderToPatchToDraft = await api.orders.get(createdOrder.id);
      if (orderToPatchToDraft.orderType === 'order') {
        orderToPatchToDraft = await api.orders.patch(createdOrder.id, { orderType: 'draft' } as any); // Use 'as any' if type complains about other missing patch props
      }

      await expect(api.orders.delete(createdOrder.id)).resolves.not.toThrow(); // Renamed from deleteDraft
      await expect(api.orders.delete('INVALID-ORDER-ID')).rejects.toThrow();

      // createdOrder is now deleted...
    });

    it('should patch draft order to order', async () => {
      // ... create order once again
      createdOrder = await api.orders.create(testOrder);

      // Patch to 'order'
      const patchedOrder = await api.orders.patch(createdOrder.id, {
        orderType: 'order',
        // files can also be updated here if needed, matching I.OrderPatchRequest
      });
      expect(patchedOrder).toBeDefined();
      expect(patchedOrder.orderType).toBe('order');
      expect(patchedOrder.orderReferenceId).toBe(testOrder.orderReferenceId); // Should not change

      await expect(api.orders.patch('INVALID-ORDER-ID', { orderType: 'order' })).rejects.toThrow();
    });

    it('should cancel order', async () => {
      // Order is currently 'order' type from previous test
      await expect(api.orders.cancel(createdOrder.id)).resolves.not.toThrow();
      await expect(api.orders.cancel('INVALID-ORDER-ID')).rejects.toThrow();
    });

    it('should search orders', async () => {
      // createdOrder exists as cancelled
      const searchResult = await api.orders.search({ ids: [createdOrder.id] });
      expect(searchResult.orders.length).toBe(1); // V4 returns OrderSearchListResponse { orders: [] }

      const s1 = await api.orders.search({ orderReferenceIds: [testOrder.orderReferenceId] });
      expect(s1.orders.length).toBeGreaterThan(0);

      // ... other search tests from original
      const s2 = await api.orders.search({ search: 'Testson' }); // Using a name from shippingAddress for search
      expect(s2.orders.length).toBeGreaterThan(0);

      const s3 = await api.orders.search({ countries: [testOrder.shippingAddress.country] });
      expect(s3.orders.length).toBeGreaterThan(0);

      const s4 = await api.orders.search({ orderReferenceId: 'INVALID-ORDER-REF-ID-FOR-SEARCH' });
      expect(s4.orders.length).toBe(0);
    });

    it('should quote order', async () => {
      // Updated testQuote for V4: recipient, products, and files structure
      const testQuote: I.OrderQuoteRequest = {
        currency: 'EUR',
        recipient: {
          // Was shippingAddress, now recipient
          firstName: 'Test',
          lastName: 'Testson',
          addressLine1: 'Test Street 123',
          city: 'Testville',
          postCode: '123 45',
          country: 'SE',
          email: 'test@example.com',
        },
        products: [
          // Was items, now products
          {
            itemReferenceId: 'DUMMY-ITEM-FOR-QUOTE-TEST',
            productUid: 'cards_pf_bb_pt_350-gsm-coated-silk_cl_4-4_hor',
            quantity: 1,
            files: [{ type: 'default', url: 'https://i1.sndcdn.com/artworks-000398776953-cwfbd0-t500x500.jpg' }],
          },
        ],
        // orderReferenceId and customerReferenceId are not part of V4 quote request body
      };
      const qResponse = await api.orders.quote(testQuote); // qResponse is I.OrderQuoteResponse
      expect(qResponse).toBeDefined();
      expect(qResponse.orderReferenceId).toBeDefined(); // Gelato might generate this or echo if passed in header/context
      expect(qResponse.quotes.length).toBeGreaterThan(0);

      const firstQuote = qResponse.quotes[0];
      expect(firstQuote.itemReferenceIds).toContain(testQuote.products[0].itemReferenceId);
      expect(firstQuote.fulfillmentCountry).toBeDefined();
      expect(firstQuote.products.length).toBeGreaterThan(0);
      expect(firstQuote.products[0].currency).toBe(testQuote.currency);
      expect(firstQuote.shipmentMethods.length).toBeGreaterThan(0);
      expect(firstQuote.shipmentMethods[0].currency).toBe(testQuote.currency);
    });

    it('should NOT delete non-draft order (if previously cancelled, re-create as draft)', async () => {
      // Re-create as draft to test deletion
      const draftOrderToTestDelete = await api.orders.create(testOrder);
      // Patch it to 'order' to simulate a non-draft order
      await api.orders.patch(draftOrderToTestDelete.id, { orderType: 'order' });
      await expect(api.orders.delete(draftOrderToTestDelete.id)).rejects.toThrow();
      // Clean up by cancelling and then patching back to draft (if necessary) then deleting
      await api.orders.cancel(draftOrderToTestDelete.id); // Cancel first
      await api.orders.patch(draftOrderToTestDelete.id, { orderType: 'draft' } as any); // Then patch to draft
      await api.orders.delete(draftOrderToTestDelete.id); // Now delete
    });

    it('should patch order back to draft', async () => {
      // Create a new order, it will be draft by default from testOrder definition
      const orderForPatchToDraft = await api.orders.create(testOrder);
      // First patch it to 'order'
      await api.orders.patch(orderForPatchToDraft.id, { orderType: 'order' });
      // Then patch it back to 'draft'
      const patchedToDraft = await api.orders.patch(orderForPatchToDraft.id, { orderType: 'draft' } as any); // Use 'as any' for simplicity if strict type complains
      expect(patchedToDraft.orderType).toBe('draft');
      // Clean up this order
      await api.orders.delete(orderForPatchToDraft.id);
    });

    it('should get order and check shipping address (formerly getShippingAddress)', async () => {
      const orderForShippingCheck = await api.orders.create(testOrder);
      const fetchedOrder = await api.orders.get(orderForShippingCheck.id);

      const sa = fetchedOrder.shippingAddress;
      const testOrderShippingAddress = testOrder.shippingAddress as I.OrderShippingAddress; // Cast for direct comparison
      const testProps = Object.keys(testOrderShippingAddress) as Array<keyof I.OrderShippingAddress>;

      testProps.forEach((p) => expect(sa[p]).toEqual(testOrderShippingAddress[p]));
      // Clean up
      await api.orders.delete(orderForShippingCheck.id);
    });

    // "should update order shipping address" test removed as the direct method is gone.
    // Updates to shippingAddress for non-draft orders are not straightforward in V4 via a dedicated endpoint.
    // If an order is 'draft', one could potentially delete and re-create, or see if PATCH supports it (docs don't explicitly state for address).

    it('should clean up any remaining test order', async () => {
      // This is a final catch-all. If createdOrder was re-assigned and not deleted in a specific test.
      // Try to fetch it, if it exists and is draft, delete it.
      try {
        if (createdOrder && createdOrder.id) {
          let finalOrderState = await api.orders.get(createdOrder.id);
          if (finalOrderState.orderType === 'draft') {
            await api.orders.delete(finalOrderState.id);
          } else if (finalOrderState.orderType === 'order' && finalOrderState.fulfillmentStatus !== 'canceled') {
            // If it's an 'order' and not cancelled, try to cancel then delete draft
            await api.orders.cancel(finalOrderState.id);
            finalOrderState = await api.orders.patch(finalOrderState.id, { orderType: 'draft' } as any);
            await api.orders.delete(finalOrderState.id);
          } else if (finalOrderState.orderType === 'order' && finalOrderState.fulfillmentStatus === 'canceled') {
            // If it's 'order' but already cancelled, patch to draft and delete
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
