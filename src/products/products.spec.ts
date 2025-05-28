import { GelatoProductApi } from './products';
import { GelatoApiBase } from '../base';
import {
  Config,
  ProductCatalog,
  Product,
  ProductCoverDimension,
  ProductPrice,
  ProductAvailability,
  // Re-using ListResponse from orders.spec.ts or define locally if needed
} from '../types';
import { AxiosInstance, AxiosResponse } from 'axios';

// Define a local ListResponse if not using one from types.ts consistently or if it's different for products
interface ListResponse<T> {
  data: T[];
  pagination: { total: number; offset: number };
}

describe('GelatoProductApi', () => {
  let productApi: GelatoProductApi;
  let mockConfig: Config;
  let mockAxiosInstance: any;
  let handleResponseSpy: jest.SpyInstance;

  beforeEach(() => {
    mockConfig = { apiKey: 'test-key' };
    productApi = new GelatoProductApi(mockConfig);

    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      // Add other methods if used by ProductApi, typically get/post
    };

    (productApi as any).axios = mockAxiosInstance;

    handleResponseSpy = jest.spyOn(GelatoApiBase.prototype as any, 'handleResponse');
    handleResponseSpy.mockImplementation(promise => promise.then((res: AxiosResponse<any>) => res.data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getCatalogs', () => {
    it('should call axios.get with correct params and handle response', async () => {
      const mockCatalogsResponse = {
        data: [],
        pagination: { total: 0, offset: 0 }
      };
      const mockAxiosResponse: AxiosResponse<any> = {
        data: mockCatalogsResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };
      mockAxiosInstance.get.mockResolvedValue(mockAxiosResponse);

      const result = await productApi.getCatalogs();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/catalogs');
      expect(handleResponseSpy).toHaveBeenCalled();
      expect(result).toEqual(mockCatalogsResponse);
    });

    it('should propagate error if axios.get fails', async () => {
      const mockError = new Error('API Error');
      mockAxiosInstance.get.mockRejectedValue(mockError);
      handleResponseSpy.mockImplementationOnce(promise => promise.catch((e: any) => { throw e; }));

      await expect(productApi.getCatalogs()).rejects.toThrow('API Error');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/catalogs');
      expect(handleResponseSpy).toHaveBeenCalled();
    });
  });

  describe('getCatalog', () => {
    const catalogUid = 'test-catalog-uid';
    const mockCatalogResponse: ProductCatalog = { catalogUid, title: 'Test Catalog', productAttributes: [] };
    const mockAxiosResponse: AxiosResponse<ProductCatalog> = {
      data: mockCatalogResponse, status: 200, statusText: 'OK', headers: {}, config: {} as any,
    };

    it('should call axios.get with correct catalogUid and handle response', async () => {
      mockAxiosInstance.get.mockResolvedValue(mockAxiosResponse);
      const result = await productApi.getCatalog(catalogUid);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/catalogs/${catalogUid}`);
      expect(handleResponseSpy).toHaveBeenCalled();
      expect(result).toEqual(mockCatalogResponse);
    });

    it('should propagate error if axios.get fails for getCatalog', async () => {
      const mockError = new Error('API Error');
      mockAxiosInstance.get.mockRejectedValue(mockError);
      handleResponseSpy.mockImplementationOnce(promise => promise.catch((e: any) => { throw e; }));
      await expect(productApi.getCatalog(catalogUid)).rejects.toThrow('API Error');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/catalogs/${catalogUid}`);
      expect(handleResponseSpy).toHaveBeenCalled();
    });
  });

  describe('getProductsInCatalog', () => {
    const catalogUid = 'test-catalog-uid';
    const params = { offset: 0, limit: 5 };
    // The actual implementation returns a specific structure, not ListResponse<Product>
    const mockApiResult = {
        products: [{
            productUid: 'product1',
            attributes: {},
            weight: {value:0, measureUnit:'g'},
            supportedCountries:[],
            notSupportedCountries: [],
            isStockable: false,
            isPrintable: true,
            dimensions: {
                width: { value: 100, measureUnit: 'mm' },
                height: { value: 100, measureUnit: 'mm' }
            }
        }],
        hits: { attributeHits: {} },
    };
    const mockAxiosResponse: AxiosResponse<typeof mockApiResult> = { // Adjusted mock response type
      data: mockApiResult, status: 200, statusText: 'OK', headers: {}, config: {} as any,
    };

    it('should call axios.post with correct catalogUid, params and handle response', async () => {
      mockAxiosInstance.post.mockResolvedValue(mockAxiosResponse);
      const result = await productApi.getProductsInCatalog(catalogUid, params);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(`/catalogs/${catalogUid}/products:search`, params);
      expect(handleResponseSpy).toHaveBeenCalled();
      expect(result).toEqual(mockApiResult);
    });
    
    it('should call axios.post without params (body is undefined) and handle response for getProductsInCatalog', async () => {
        mockAxiosInstance.post.mockResolvedValue(mockAxiosResponse); // Reusing mock response
        const result = await productApi.getProductsInCatalog(catalogUid, {}); // params will be undefined
        expect(mockAxiosInstance.post).toHaveBeenCalledWith(`/catalogs/${catalogUid}/products:search`, {});
        expect(handleResponseSpy).toHaveBeenCalled();
        expect(result).toEqual(mockApiResult);
    });

    it('should propagate error for getProductsInCatalog', async () => {
      const mockError = new Error('API Error');
      mockAxiosInstance.post.mockRejectedValue(mockError); // Using post
      handleResponseSpy.mockImplementationOnce(promise => promise.catch((e: any) => { throw e; }));
      await expect(productApi.getProductsInCatalog(catalogUid, params)).rejects.toThrow('API Error');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(`/catalogs/${catalogUid}/products:search`, params);
    });
  });

  describe('getProduct', () => {
    const productUid = 'test-product-uid';
    const mockProductResponse = {
      productUid,
      attributes: {},
      weight: { value: 0, measureUnit: 'g' },
      supportedCountries: [],
      notSupportedCountries: [],
      isStockable: false,
      isPrintable: true,
      dimensions: {
        width: { value: 100, measureUnit: 'mm' },
        height: { value: 100, measureUnit: 'mm' }
      }
    } as Product;

    it('should call axios.get with correct params and handle response', async () => {
      const mockAxiosResponse: AxiosResponse<Product> = {
        data: mockProductResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };
      mockAxiosInstance.get.mockResolvedValue(mockAxiosResponse);

      const result = await productApi.getProduct(productUid);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/products/${productUid}`);
      expect(handleResponseSpy).toHaveBeenCalled();
      expect(result).toEqual(mockProductResponse);
    });

    it('should propagate error if axios.get fails', async () => {
      const mockError = new Error('API Error');
      mockAxiosInstance.get.mockRejectedValue(mockError);
      handleResponseSpy.mockImplementationOnce(promise => promise.catch((e: any) => { throw e; }));

      await expect(productApi.getProduct(productUid)).rejects.toThrow('API Error');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/products/${productUid}`);
      expect(handleResponseSpy).toHaveBeenCalled();
    });
  });

  describe('getCoverDimensions', () => {
    const productUid = 'test-product-uid-cover';
    const pagesCount = 100;

    it('should call axios.get with correct params and handle response', async () => {
      const mockDimensionsResponse: ProductCoverDimension = {
        productUid,
        pagesCount,
        measureUnit: 'mm'
      };
      const mockAxiosResponse: AxiosResponse<ProductCoverDimension> = {
        data: mockDimensionsResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };
      mockAxiosInstance.get.mockResolvedValue(mockAxiosResponse);

      const result = await productApi.getCoverDimensions(productUid, pagesCount);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/products/${productUid}/cover-dimensions`, {
        params: { pageCount: pagesCount }
      });
      expect(handleResponseSpy).toHaveBeenCalled();
      expect(result).toEqual(mockDimensionsResponse);
    });

    it('should propagate error if axios.get fails', async () => {
      const mockError = new Error('API Error');
      mockAxiosInstance.get.mockRejectedValue(mockError);
      handleResponseSpy.mockImplementationOnce(promise => promise.catch((e: any) => { throw e; }));

      await expect(productApi.getCoverDimensions(productUid, pagesCount)).rejects.toThrow('API Error');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/products/${productUid}/cover-dimensions`, {
        params: { pageCount: pagesCount }
      });
      expect(handleResponseSpy).toHaveBeenCalled();
    });
  });

  describe('getPrice', () => {
    const productUid = 'test-product-uid-price';
    const country = 'US';
    const currency = 'USD';
    const pageCount = 100;

    it('should call axios.get with correct params and handle response', async () => {
      const mockPriceResponse: ProductPrice[] = [{
        productUid,
        country,
        currency,
        quantity: 1,
        price: 10.99,
        pageCount
      }];
      const mockAxiosResponse: AxiosResponse<ProductPrice[]> = {
        data: mockPriceResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };
      mockAxiosInstance.get.mockResolvedValue(mockAxiosResponse);

      const result = await productApi.getPrice(productUid, country, currency, pageCount);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/products/${productUid}/prices`, {
        params: { country, currency, pageCount }
      });
      expect(handleResponseSpy).toHaveBeenCalled();
      expect(result).toEqual(mockPriceResponse);
    });

    it('should propagate error if axios.get fails', async () => {
      const mockError = new Error('API Error');
      mockAxiosInstance.get.mockRejectedValue(mockError);
      handleResponseSpy.mockImplementationOnce(promise => promise.catch((e: any) => { throw e; }));

      await expect(productApi.getPrice(productUid, country, currency, pageCount)).rejects.toThrow('API Error');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/products/${productUid}/prices`, {
        params: { country, currency, pageCount }
      });
      expect(handleResponseSpy).toHaveBeenCalled();
    });
  });

  describe('getStockAvailability', () => {
    const productUids = ['prod1', 'prod2'];

    it('should call axios.post with correct params and handle response', async () => {
      const mockApiResponseBody = {
        productsAvailability: [{
          productUid: 'prod1',
          availability: [{
            stockRegionUid: 'region1',
            status: 'in-stock' as const,
            replenishmentDate: null
          }]
        }]
      };
      const mockAxiosResponse: AxiosResponse<{ productsAvailability: ProductAvailability[] }> = {
        data: mockApiResponseBody,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };
      mockAxiosInstance.post.mockResolvedValue(mockAxiosResponse);

      const result = await productApi.getStockAvailability(productUids);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/stock/region-availability', { products: productUids });
      expect(handleResponseSpy).toHaveBeenCalled();
      expect(result).toEqual(mockApiResponseBody.productsAvailability);
    });

    it('should propagate error if axios.post fails', async () => {
      const mockError = new Error('API Error');
      mockAxiosInstance.post.mockRejectedValue(mockError);
      handleResponseSpy.mockImplementationOnce(promise => promise.catch((e: any) => { throw e; }));

      await expect(productApi.getStockAvailability(productUids)).rejects.toThrow('API Error');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/stock/region-availability', { products: productUids });
      expect(handleResponseSpy).toHaveBeenCalled();
    });
  });
});