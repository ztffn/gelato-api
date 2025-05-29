import { GelatoApiBase } from '../base';
import { AxiosResponse } from 'axios';
import {
  Config,
  ProductCatalog,
  Product,
  ProductCoverDimension,
  ProductPrice,
  ProductAvailability,
  ProductSearchRequest,
  ProductSearchResponse,
} from '../types';

/**
 * Gelato Product API client.
 * Provides methods for interacting with the Gelato Product API.
 * @see https://order.gelatoapis.com
 * @see Docs/APIv4/Gelato_API_2-2-1_ListCatalogs.md
 * @see Docs/APIv4/Gelato_API_2-2-2_GetCatalog.md
 * @see Docs/APIv4/Gelato_API_2-3-1_SearchProducts.md
 * @see Docs/APIv4/Gelato_API_2-3-2_GetProduct.md
 * @see Docs/APIv4/Gelato_API_2-3-3_CoverDimensions.md
 * @see Docs/APIv4/Gelato_API_2-4_Price.md
 * @see Docs/APIv4/Gelato_API_2-5_StockAvailability.md
 */
export class GelatoProductApi extends GelatoApiBase {
  /**
   * Constructs a new GelatoProductApi instance.
   * @param {Config} config - The configuration object including the API key.
   */
  constructor(config: Config) {
    super(config, 'https://product.gelatoapis.com/v3');
  }

  /**
   * Retrieves all available product catalogs.
   * @returns {Promise<ProductCatalog[]>} A promise that resolves with an array of product catalogs.
   * @see Docs/APIv4/Gelato_API_2-2-1_ListCatalogs.md
   */
  getCatalogs(): Promise<ProductCatalog[]> {
    const promise: Promise<AxiosResponse<{ data: ProductCatalog[] }>> = this.axios.get<{ data: ProductCatalog[] }>('/catalogs');
    return this.handleResponse(promise).then(res => res.data);
  }

  /**
   * Retrieves a specific product catalog by its UID.
   * @param {string} catalogUid - The unique identifier for the catalog.
   * @returns {Promise<ProductCatalog>} A promise that resolves with the catalog details.
   * @see Docs/APIv4/Gelato_API_2-2-2_GetCatalog.md
   */
  getCatalog(catalogUid: string): Promise<ProductCatalog> {
    const promise: Promise<AxiosResponse<ProductCatalog>> = this.axios.get<ProductCatalog>(`/catalogs/${catalogUid}`);
    return this.handleResponse(promise);
  }

  /**
   * Searches for products within a specific catalog.
   * @param {string} catalogUid - The unique identifier for the catalog.
   * @param {ProductSearchRequest} params - The search parameters.
   * @returns {Promise<ProductSearchResponse>} A promise that resolves with the search results.
   * @see Docs/APIv4/Gelato_API_2-3-1_SearchProducts.md
   */
  getProductsInCatalog(catalogUid: string, params: ProductSearchRequest): Promise<ProductSearchResponse> {
    const promise: Promise<AxiosResponse<ProductSearchResponse>> = this.axios.post<ProductSearchResponse>(`/catalogs/${catalogUid}/products:search`, params);
    return this.handleResponse(promise);
  }

  /**
   * Retrieves a specific product by its UID.
   * @param {string} productUid - The unique identifier for the product.
   * @returns {Promise<Product>} A promise that resolves with the product details.
   * @see Docs/APIv4/Gelato_API_2-3-2_GetProduct.md
   */
  getProduct(productUid: string): Promise<Product> {
    const promise: Promise<AxiosResponse<Product>> = this.axios.get<Product>(`/products/${productUid}`);
    return this.handleResponse(promise);
  }

  /**
   * Retrieves cover dimensions for a product.
   * @param {string} productUid - The unique identifier for the product.
   * @param {number} pageCount - The number of pages.
   * @returns {Promise<ProductCoverDimension>} A promise that resolves with the cover dimensions.
   * @see Docs/APIv4/Gelato_API_2-3-3_CoverDimensions.md
   */
  getCoverDimensions(productUid: string, pageCount: number): Promise<ProductCoverDimension> {
    const promise: Promise<AxiosResponse<ProductCoverDimension>> = this.axios.get<ProductCoverDimension>(`/products/${productUid}/cover-dimensions`, {
      params: { pageCount }
    });
    return this.handleResponse(promise);
  }

  /**
   * Retrieves price information for a product.
   * @param {string} productUid - The unique identifier for the product.
   * @param {string} [country] - Optional country ISO code.
   * @param {string} [currency] - Optional currency ISO code.
   * @param {number} [pageCount] - Optional page count for multi-page products.
   * @returns {Promise<ProductPrice[]>} A promise that resolves with the price information.
   * @see Docs/APIv4/Gelato_API_2-4_Price.md
   */
  getPrice(productUid: string, country?: string, currency?: string, pageCount?: number): Promise<ProductPrice[]> {
    const promise: Promise<AxiosResponse<ProductPrice[]>> = this.axios.get<ProductPrice[]>(`/products/${productUid}/prices`, {
      params: { country, currency, pageCount }
    });
    return this.handleResponse(promise);
  }

  /**
   * Retrieves stock availability for products.
   * @param {string[]} products - Array of product UIDs to check availability for.
   * @returns {Promise<ProductAvailability[]>} A promise that resolves with the stock availability.
   * @see Docs/APIv4/Gelato_API_2-5_StockAvailability.md
   */
  getStockAvailability(products: string[]): Promise<ProductAvailability[]> {
    const promise: Promise<AxiosResponse<{ productsAvailability: ProductAvailability[] }>> = this.axios.post<{ productsAvailability: ProductAvailability[] }>('/stock/region-availability', { products });
    return this.handleResponse(promise).then(response => response.productsAvailability);
  }
}
