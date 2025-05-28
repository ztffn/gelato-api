import { GelatoOrdersV3Api } from './orders-v3';
import { GelatoApiBase } from '../base'; // Import to spy on its prototype
import { 
  Config, 
  OrderCreateRequest, 
  Order, 
  OrderSearchRequest, 
  OrderSearch, 
  OrderQuoteRequest, 
  OrderQuote, 
  OrderShippingAddress, 
  PatchOperation, 
  OrderItem,
} from '../types';
import { AxiosInstance, AxiosResponse } from 'axios'; // Import Axios types

// Define a local ListResponse if not using one from types.ts consistently
interface ListResponse<T> {
  data: T[];
  pagination: { total: number; offset: number };
}

describe('GelatoOrdersV3Api', () => {
  let ordersV3Api: GelatoOrdersV3Api;
  let mockConfig: Config;
  let mockAxiosInstance: jest.Mocked<AxiosInstance>;
  let handleResponseSpy: jest.SpyInstance;

  beforeEach(() => {
    mockConfig = { apiKey: 'test-key' };
    ordersV3Api = new GelatoOrdersV3Api(mockConfig);

    // Create a mock axios instance
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      // Add other axios methods if they are used by GelatoApiBase or GelatoOrdersV3Api indirectly
      // For this test, we only care about methods directly called in GelatoOrdersV3Api
    } as unknown as jest.Mocked<AxiosInstance>; // Use unknown for type assertion

    // Replace the actual axios instance in ordersV3Api with our mock
    (ordersV3Api as any).axios = mockAxiosInstance;

    // Spy on the actual handleResponse method on the GelatoApiBase prototype
    // This allows us to verify it's called and to control its behavior if needed,
    // without fully mocking the base class if we want to test some of its logic.
    // For these tests, we mostly want to ensure it's called with the promise from axios.
    handleResponseSpy = jest.spyOn(GelatoApiBase.prototype as any, 'handleResponse');
    // Default spy implementation to mimic real behavior for success path
    handleResponseSpy.mockImplementation(promise => promise.then((res: AxiosResponse<any>) => res.data));
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Cleans up all spies
  });

  describe('create', () => {
    const orderCreateRequest: OrderCreateRequest = {
      orderReferenceId: 'test-order-ref', customerReferenceId: 'test-customer-ref', currency: 'USD',
      items: [{ itemReferenceId: 'item-ref', productUid: 'product-uid', quantity: 1 }],
      shippingAddress: { firstName: 'John', lastName: 'Doe', addressLine1: '123 Main St', city: 'Anytown', postCode: '12345', country: 'US', email: 'john.doe@example.com' },
    };
    const mockOrderItems: OrderItem[] = orderCreateRequest.items.map((item, index) => ({
        ...item, id: `item-id-${index}`, fulfillmentStatus: 'created', fileUrl: 'http://example.com/file.pdf', processedFileUrl: 'http://example.com/processed.pdf', previews: [], options: [],
    }));
    const mockAxiosResponse: AxiosResponse<Order> = {
      data: { ...orderCreateRequest, id: 'order-id-123', orderType: 'order', fulfillmentStatus: 'created', financialStatus: 'created', channel: 'api', createdAt: '', updatedAt: '', orderedAt: '', items: mockOrderItems, receipts: [] },
      status: 201, statusText: 'Created', headers: {}, config: {} as any,
    };

    it('should call this.axios.post and this.handleResponse, then return data', async () => {
      mockAxiosInstance.post.mockResolvedValue(mockAxiosResponse);
      
      const result = await ordersV3Api.create(orderCreateRequest);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/v3/orders', orderCreateRequest);
      expect(handleResponseSpy).toHaveBeenCalled();
      expect(result).toEqual(mockAxiosResponse.data);
    });

    it('should propagate error if axios.post fails', async () => {
      const mockError = new Error('Network error');
      mockAxiosInstance.post.mockRejectedValue(mockError);
      // Ensure handleResponse re-throws the error for this test case
      handleResponseSpy.mockImplementationOnce(promise => promise.catch((e: any) => { throw e; }));


      await expect(ordersV3Api.create(orderCreateRequest)).rejects.toThrow('Network error');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/v3/orders', orderCreateRequest);
      expect(handleResponseSpy).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    const orderId = 'order-id-123';
    const mockAxiosResponse: AxiosResponse<Order> = {
      data: { id: orderId, orderReferenceId: 'test-order-ref' } as Order, // Cast for partial mock
      status: 200, statusText: 'OK', headers: {}, config: {} as any,
    };

    it('should call this.axios.get and this.handleResponse, then return data', async () => {
      mockAxiosInstance.get.mockResolvedValue(mockAxiosResponse);
      const result = await ordersV3Api.get(orderId);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/v3/orders/${orderId}`);
      expect(handleResponseSpy).toHaveBeenCalled();
      expect(result).toEqual(mockAxiosResponse.data);
    });

    it('should propagate error if axios.get fails', async () => {
      const mockError = new Error('API Error');
      mockAxiosInstance.get.mockRejectedValue(mockError);
      handleResponseSpy.mockImplementationOnce(promise => promise.catch((e: any) => { throw e; }));
      await expect(ordersV3Api.get(orderId)).rejects.toThrow('API Error');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/v3/orders/${orderId}`);
      expect(handleResponseSpy).toHaveBeenCalled();
    });
  });

  describe('search', () => {
    const searchParams: OrderSearchRequest = { limit: 10, offset: 0 };
    const mockAxiosResponse: AxiosResponse<ListResponse<OrderSearch>> = {
      data: { data: [], pagination: { total: 0, offset: 0 } },
      status: 200, statusText: 'OK', headers: {}, config: {} as any,
    };

    it('should call this.axios.get with params and this.handleResponse, then return data', async () => {
      mockAxiosInstance.get.mockResolvedValue(mockAxiosResponse);
      const result = await ordersV3Api.search(searchParams);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v3/orders', { params: searchParams });
      expect(handleResponseSpy).toHaveBeenCalled();
      expect(result).toEqual(mockAxiosResponse.data);
    });
  });
  
  describe('patchDraft', () => {
    const orderId = 'draft-order-id-456';
    const operations: PatchOperation[] = [{ op: 'replace', path: '/customerReferenceId', value: 'new-customer-ref' }];
    const mockAxiosResponse: AxiosResponse<Order> = {
      data: { id: orderId, customerReferenceId: 'new-customer-ref' } as Order,
      status: 200, statusText: 'OK', headers: {}, config: {} as any,
    };

    it('should call axios.patch and handleResponse', async () => {
      mockAxiosInstance.patch.mockResolvedValue(mockAxiosResponse);
      const result = await ordersV3Api.patchDraft(orderId, operations);
      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(`/v3/orders/draft/${orderId}`, operations);
      expect(handleResponseSpy).toHaveBeenCalled();
      expect(result).toEqual(mockAxiosResponse.data);
    });
  });

  describe('update', () => {
    const orderId = 'order-id-789';
    const orderUpdateRequest: Partial<Order> = { orderReferenceId: 'updated-order-ref' };
     const mockAxiosResponse: AxiosResponse<Order> = {
      data: { ...orderUpdateRequest, id: orderId } as Order,
      status: 200, statusText: 'OK', headers: {}, config: {} as any,
    };

    it('should call axios.put and handleResponse', async () => {
      mockAxiosInstance.put.mockResolvedValue(mockAxiosResponse);
      const result = await ordersV3Api.update(orderId, orderUpdateRequest);
      expect(mockAxiosInstance.put).toHaveBeenCalledWith(`/v3/orders/${orderId}`, orderUpdateRequest);
      expect(handleResponseSpy).toHaveBeenCalled();
      expect(result).toEqual(mockAxiosResponse.data);
    });
  });

  describe('deleteDraft', () => {
    const orderId = 'draft-to-delete-id';
    const mockAxiosResponse: AxiosResponse<void> = { // void for delete typically
      data: undefined as any, status: 204, statusText: 'No Content', headers: {}, config: {} as any,
    };

    it('should call axios.delete and handleResponse', async () => {
      mockAxiosInstance.delete.mockResolvedValue(mockAxiosResponse);
      await ordersV3Api.deleteDraft(orderId);
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`/v3/orders/draft/${orderId}`);
      expect(handleResponseSpy).toHaveBeenCalled();
    });
  });

  describe('cancel', () => {
    const orderId = 'order-to-cancel-id';
     const mockAxiosResponse: AxiosResponse<void> = {
      data: undefined as any, status: 200, statusText: 'OK', headers: {}, config: {} as any, // Or 204
    };
    it('should call axios.post and handleResponse for cancel', async () => {
      mockAxiosInstance.post.mockResolvedValue(mockAxiosResponse);
      await ordersV3Api.cancel(orderId);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(`/v3/orders/${orderId}:cancel`, {});
      expect(handleResponseSpy).toHaveBeenCalled();
    });
  });

  describe('quote', () => {
    const quoteRequest: OrderQuoteRequest = {
      orderReferenceId: 'quote-ref-1', customerReferenceId: 'cust-ref-1', currency: 'USD',
      recipient: { firstName: 'Test', lastName: 'User', addressLine1: '1 Test Ln', city: 'Testville', postCode: '12345', country: 'US', email: 'test@example.com' },
      products: [{ itemReferenceId: 'prod-item-1', productUid: 'canvas_12x12', quantity: 1 }],
    };
    const mockAxiosResponse: AxiosResponse<{ orderReferenceId: string; quotes: OrderQuote[] }> = {
      data: { orderReferenceId: 'quote-ref-1', quotes: [] },
      status: 200, statusText: 'OK', headers: {}, config: {} as any,
    };
    it('should call axios.post and handleResponse for quote', async () => {
      mockAxiosInstance.post.mockResolvedValue(mockAxiosResponse);
      const result = await ordersV3Api.quote(quoteRequest);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/v3/orders/quote', quoteRequest);
      expect(handleResponseSpy).toHaveBeenCalled();
      expect(result).toEqual(mockAxiosResponse.data);
    });
  });
  
  describe('getShippingAddress', () => {
    const orderId = 'order-id-for-shipping';
    const mockAxiosResponse: AxiosResponse<OrderShippingAddress> = {
      data: { firstName: 'Test', lastName: 'User', addressLine1: '1 Test Ln', city: 'Testville', postCode: '12345', country: 'US', email: 'test@example.com' },
      status: 200, statusText: 'OK', headers: {}, config: {} as any,
    };
    it('should call axios.get and handleResponse for getShippingAddress', async () => {
      mockAxiosInstance.get.mockResolvedValue(mockAxiosResponse);
      const result = await ordersV3Api.getShippingAddress(orderId);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/v3/orders/${orderId}/shipping-address`);
      expect(handleResponseSpy).toHaveBeenCalled();
      expect(result).toEqual(mockAxiosResponse.data);
    });
  });

  describe('updateShippingAddress', () => {
    const orderId = 'order-id-for-shipping-update';
    const addressUpdatePayload: OrderShippingAddress = { firstName: 'Updated', lastName: 'User', addressLine1: '2 Updated Test Ln', city: 'Testville', postCode: '12345', country: 'US', email: 'test@example.com' };
    const mockAxiosResponse: AxiosResponse<OrderShippingAddress> = {
      data: { ...addressUpdatePayload },
      status: 200, statusText: 'OK', headers: {}, config: {} as any,
    };
    it('should call axios.put and handleResponse for updateShippingAddress', async () => {
      mockAxiosInstance.put.mockResolvedValue(mockAxiosResponse);
      const result = await ordersV3Api.updateShippingAddress(orderId, addressUpdatePayload); 
      expect(mockAxiosInstance.put).toHaveBeenCalledWith(`/v3/orders/${orderId}/shipping-address`, addressUpdatePayload);
      expect(handleResponseSpy).toHaveBeenCalled();
      expect(result).toEqual(mockAxiosResponse.data);
    });
  });
});
