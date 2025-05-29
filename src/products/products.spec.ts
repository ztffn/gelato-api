import { GelatoProductApi } from './products';
import { GelatoApiBase } from '../base';
import {
  Config,
  ProductCatalog,
  Product,
  ProductCoverDimension,
  ProductPrice,
  ProductAvailability,
} from '../types';
import { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

describe('GelatoProductApi', () => {
  let productApi: GelatoProductApi;
  let mockConfig: Config;
  let mockAxiosInstance: jest.Mocked<AxiosInstance>;
  let handleResponseSpy: jest.SpyInstance;

  beforeEach(() => {
    mockConfig = { apiKey: 'test-key' };
    productApi = new GelatoProductApi(mockConfig);

    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<AxiosInstance>;

    (productApi as unknown as { axios: AxiosInstance }).axios = mockAxiosInstance;

    handleResponseSpy = jest.spyOn(GelatoApiBase.prototype as unknown as { handleResponse: (promise: Promise<AxiosResponse>) => Promise<unknown> }, 'handleResponse');
    handleResponseSpy.mockImplementation(promise => promise.then((res: AxiosResponse<unknown>) => res.data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getCatalogs', () => {
    it('should call axios.get and handleResponse for getCatalogs', async () => {
      const mockCatalogs: ProductCatalog[] = [
        { catalogUid: 'catalog1', title: 'Catalog 1', productAttributes: [] },
        { catalogUid: 'catalog2', title: 'Catalog 2', productAttributes: [] }
      ];
      const mockAxiosResponse: AxiosResponse<ProductCatalog[]> = {
        data: mockCatalogs,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as AxiosRequestConfig,
      };

      mockAxiosInstance.get.mockResolvedValue(mockAxiosResponse);
      const result = await productApi.getCatalogs();
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/catalogs');
      expect(handleResponseSpy).toHaveBeenCalled();
      expect(result).toEqual(mockCatalogs);
    });

    it('should propagate error if axios.get fails for getCatalogs', async () => {
      const mockError = new Error('API Error');
      mockAxiosInstance.get.mockRejectedValue(mockError);
      handleResponseSpy.mockImplementationOnce(promise => promise.catch((e: unknown) => { throw e; }));

      await expect(productApi.getCatalogs()).rejects.toThrow('API Error');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/catalogs');
      expect(handleResponseSpy).toHaveBeenCalled();
    });
  });

  describe('getCatalog', () => {
    const catalogUid = 'test-catalog-uid';
    const mockCatalogResponse: ProductCatalog = { catalogUid, title: 'Test Catalog', productAttributes: [] };
    const mockAxiosResponse: AxiosResponse<ProductCatalog> = {
      data: mockCatalogResponse, 
      status: 200, 
      statusText: 'OK', 
      headers: {}, 
      config: {} as AxiosRequestConfig,
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
      handleResponseSpy.mockImplementationOnce(promise => promise.catch((e: unknown) => { throw e; }));
      await expect(productApi.getCatalog(catalogUid)).rejects.toThrow('API Error');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/catalogs/${catalogUid}`);
      expect(handleResponseSpy).toHaveBeenCalled();
    });
  });

  describe('getProductsInCatalog', () => {
    const catalogUid = 'test-catalog-uid';
    const params = { offset: 0, limit: 5 };
    const mockApiResult = {
      products: [{
        productUid: 'product1',
        attributes: {},
        weight: {value: 0, measureUnit: 'g'},
        supportedCountries: [],
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
    const mockAxiosResponse: AxiosResponse<typeof mockApiResult> = {
      data: mockApiResult, 
      status: 200, 
      statusText: 'OK', 
      headers: {}, 
      config: {} as AxiosRequestConfig,
    };

    it('should call axios.post with correct catalogUid, params and handle response', async () => {
      mockAxiosInstance.post.mockResolvedValue(mockAxiosResponse);
      const result = await productApi.getProductsInCatalog(catalogUid, params);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(`/catalogs/${catalogUid}/products:search`, params);
      expect(handleResponseSpy).toHaveBeenCalled();
      expect(result).toEqual(mockApiResult);
    });
    
    it('should call axios.post without params (body is undefined) and handle response for getProductsInCatalog', async () => {
      mockAxiosInstance.post.mockResolvedValue(mockAxiosResponse);
      const result = await productApi.getProductsInCatalog(catalogUid, {});
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(`/catalogs/${catalogUid}/products:search`, {});
      expect(handleResponseSpy).toHaveBeenCalled();
      expect(result).toEqual(mockApiResult);
    });

    it('should propagate error for getProductsInCatalog', async () => {
      const mockError = new Error('API Error');
      mockAxiosInstance.post.mockRejectedValue(mockError);
      handleResponseSpy.mockImplementationOnce(promise => promise.catch((e: unknown) => { throw e; }));
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
        config: {} as AxiosRequestConfig
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
      handleResponseSpy.mockImplementationOnce(promise => promise.catch((e: unknown) => { throw e; }));

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
        config: {} as AxiosRequestConfig
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
      handleResponseSpy.mockImplementationOnce(promise => promise.catch((e: unknown) => { throw e; }));

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
        price: 10.99,
        currency,
        country,
        quantity: 1,
        pageCount
      }];
      const mockAxiosResponse: AxiosResponse<ProductPrice[]> = {
        data: mockPriceResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as AxiosRequestConfig
      };
      mockAxiosInstance.get.mockResolvedValue(mockAxiosResponse);

      const result = await productApi.getPrice(productUid, country, currency, pageCount);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/products/${productUid}/price`, {
        params: { country, currency, pageCount }
      });
      expect(handleResponseSpy).toHaveBeenCalled();
      expect(result).toEqual(mockPriceResponse);
    });

    it('should propagate error if axios.get fails', async () => {
      const mockError = new Error('API Error');
      mockAxiosInstance.get.mockRejectedValue(mockError);
      handleResponseSpy.mockImplementationOnce(promise => promise.catch((e: unknown) => { throw e; }));

      await expect(productApi.getPrice(productUid, country, currency, pageCount)).rejects.toThrow('API Error');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/products/${productUid}/price`, {
        params: { country, currency, pageCount }
      });
      expect(handleResponseSpy).toHaveBeenCalled();
    });
  });

  describe('getStockAvailability', () => {
    it('should call axios.post and handleResponse for getStockAvailability', async () => {
      const products = ['product-1', 'product-2'];
      const mockApiResponseBody = {
        productsAvailability: [
          {
            productUid: 'product-1',
            availability: [{
              stockRegionUid: 'region1',
              status: 'in-stock' as const,
              replenishmentDate: null
            }]
          },
          {
            productUid: 'product-2',
            availability: [{
              stockRegionUid: 'region1',
              status: 'out-of-stock' as const,
              replenishmentDate: null
            }]
          }
        ]
      };
      const mockAxiosResponse: AxiosResponse<{ productsAvailability: ProductAvailability[] }> = {
        data: mockApiResponseBody,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as AxiosRequestConfig,
      };

      mockAxiosInstance.post.mockResolvedValue(mockAxiosResponse);
      const result = await productApi.getStockAvailability(products);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/stock/region-availability', { products });
      expect(handleResponseSpy).toHaveBeenCalled();
      expect(result).toEqual(mockApiResponseBody.productsAvailability);
    });
  });
});