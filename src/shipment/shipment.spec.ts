import { GelatoShipmentApi } from './shipment';
import { GelatoApiBase } from '../base';
import { Config, ShipmentMethod } from '../types'; // Assuming ListResponse is also in types or defined locally
import { AxiosInstance, AxiosResponse } from 'axios';

// Define ListResponse locally or ensure it's imported if it's generic enough from types.ts
interface ListResponse<T> {
  data: T[];
  // Assuming pagination structure if relevant, or simplify if not used by shipment methods endpoint
  pagination?: { total: number; offset: number }; 
}

describe('GelatoShipmentApi', () => {
  let shipmentApi: GelatoShipmentApi;
  let mockConfig: Config;
  let mockAxiosInstance: jest.Mocked<AxiosInstance>;
  let handleResponseSpy: jest.SpyInstance;

  beforeEach(() => {
    mockConfig = { apiKey: 'test-key' };
    shipmentApi = new GelatoShipmentApi(mockConfig);

    mockAxiosInstance = {
      get: jest.fn(),
      // Add other methods if used by ShipmentApi, typically just get for this one
    } as unknown as jest.Mocked<AxiosInstance>;

    (shipmentApi as any).axios = mockAxiosInstance;

    handleResponseSpy = jest.spyOn(GelatoApiBase.prototype as any, 'handleResponse');
    handleResponseSpy.mockImplementation(promise => promise.then((res: AxiosResponse<any>) => res.data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getMethods', () => {
    const mockShipmentMethods: ShipmentMethod[] = [
      { shipmentMethodUid: 'method1', type: 'normal', name: 'Standard Shipping', isBusiness: false, isPrivate: true, hasTracking: true, supportedCountries: ['US', 'CA'] },
      { shipmentMethodUid: 'method2', type: 'express', name: 'Express Shipping', isBusiness: true, isPrivate: true, hasTracking: true, supportedCountries: ['US'] },
    ];
    // The API is documented to return ShipmentMethod[] directly, not a ListResponse object.
    // See: https://docs.gelato.com/reference/getshippingmethods
    const mockAxiosResponse: AxiosResponse<ShipmentMethod[]> = {
      data: mockShipmentMethods,
      status: 200, statusText: 'OK', headers: {}, config: {} as any,
    };

    it('should call axios.get with correct params and handle response for getMethods', async () => {
      const params = { country: 'US', currency: 'USD' };
      mockAxiosInstance.get.mockResolvedValue(mockAxiosResponse);

      const result = await shipmentApi.getMethods(params);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v1/shipping/methods', { params });
      expect(handleResponseSpy).toHaveBeenCalled();
      expect(result).toEqual(mockShipmentMethods);
    });

    it('should call axios.get without params and handle response for getMethods', async () => {
      mockAxiosInstance.get.mockResolvedValue(mockAxiosResponse); // Re-using response for simplicity
      
      const result = await shipmentApi.getMethods();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v1/shipping/methods', { params: undefined });
      expect(handleResponseSpy).toHaveBeenCalled();
      expect(result).toEqual(mockShipmentMethods);
    });

    it('should propagate error if axios.get fails for getMethods', async () => {
      const params = { country: 'US', currency: 'USD' };
      const mockError = new Error('API Error');
      mockAxiosInstance.get.mockRejectedValue(mockError);
      handleResponseSpy.mockImplementationOnce(promise => promise.catch((e: any) => { throw e; }));

      await expect(shipmentApi.getMethods(params)).rejects.toThrow('API Error');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v1/shipping/methods', { params });
      expect(handleResponseSpy).toHaveBeenCalled();
    });
  });
});
