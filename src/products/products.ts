import { GelatoApiBase } from '../base';
import {
  Config,
  ListResponse,
  ProductCatalog,
  ProductSearch,
  Product,
  ProductCoverDimension,
  ProductPrice,
  ProductAvailability,
} from '../types';

/**
 * Gelato Product API client.
 * Provides methods for interacting with Gelato's Product APIs.
 * Note: This SDK is undergoing updates. While these methods function,
 * they may be based on older versions of the Gelato API (e.g., V1 or V3 paths).
 * Refer to ROADMAP.md for plans regarding full V4 API integration and the latest features.
 * @see https://docs.gelato.com/reference/products
 */
export class GelatoProductApi extends GelatoApiBase {
  // Internal note on base URL strategy:
  // The static baseUrl is set to V3. GelatoApiBase constructor uses this.
  // Individual method paths (e.g., '/catalogs', '/products/*') are relative to this base.
  // This implies these endpoints are under the V3 version path.
  // If some endpoints were V1 (like '/v1/catalogs' as seen in old tests),
  // they would need explicit versioning in their path or a different base URL strategy.
  // For this version, we assume paths are relative to the class's static baseUrl.
  static baseUrl = 'https://product.gelatoapis.com/v3';

  /**
   * Constructs a new GelatoProductApi instance.
   * @param {Config} config - The configuration object including the API key.
   */
  constructor(config: Config) {
    super(config); // This will use GelatoProductApi.baseUrl
  }

  /**
   * Retrieves a list of product catalogs.
   * @param {object} [params] - Optional parameters.
   * @param {number} [params.offset] - The number of catalogs to skip before starting to collect the result set.
   * @param {number} [params.limit] - The numbers of catalogs to return.
   * @returns {Promise<ListResponse<ProductCatalog>>} A promise that resolves with a list of product catalogs and pagination information.
   * @see https://docs.gelato.com/reference/getcatalogs
   */
  getCatalogs(params?: { offset?: number; limit?: number }): Promise<ListResponse<ProductCatalog>> {
    return this.handleResponse(this.axios.get<ListResponse<ProductCatalog>>('/catalogs', { params }));
  }

  /**
   * Retrieves a specific product catalog by its UID.
   * @param {string} catalogUid - The unique identifier for the catalog.
   * @returns {Promise<ProductCatalog>} A promise that resolves with the product catalog details.
   * @see https://docs.gelato.com/reference/getcatalogbyuid
   */
  getCatalog(catalogUid: string): Promise<ProductCatalog> {
    return this.handleResponse(this.axios.get<ProductCatalog>(`/catalogs/${catalogUid}`));
  }

  /**
   * Searches for products within a specific catalog.
   * @param {string} catalogUid - The unique identifier for the catalog.
   * @param {object} [params] - Optional parameters for searching and filtering.
   * @param {number} [params.offset] - The number of products to skip.
   * @param {number} [params.limit] - The number of products to return.
   * @param {{ [name: string]: string[] }} [params.attributeFilters] - Filters based on product attributes.
   * @returns {Promise<{ products: ProductSearch[]; hits: { attributeHits: { [attributeName: string]: { [attributeValue: string]: number } } }; }>}
   * A promise that resolves with the search results, including products and attribute hit counts.
   * @see https://docs.gelato.com/reference/searchproductsincatalog
   */
  getProductsInCatalog(
    catalogUid: string,
    params?: {
      offset?: number;
      limit?: number;
      attributeFilters?: { [name: string]: string[] };
    },
  ): Promise<{
    products: ProductSearch[];
    hits: { attributeHits: { [attributeName: string]: { [attributeValue: string]: number } } };
  }> {
    return this.handleResponse(this.axios.post(`/catalogs/${catalogUid}/products:search`, params));
  }

  /**
   * Retrieves a specific product by its UID.
   * @param {string} productUid - The unique identifier for the product.
   * @returns {Promise<Product>} A promise that resolves with the product details.
   * @see https://docs.gelato.com/reference/getproductbyuid
   */
  getProduct(productUid: string): Promise<Product> {
    return this.handleResponse(this.axios.get<Product>(`/products/${productUid}`));
  }

  /**
   * Retrieves cover dimensions for a product (e.g., a photobook).
   * @param {string} productUid - The unique identifier for the product.
   * @param {{ pageCount: number }} params - Parameters including the page count.
   * @returns {Promise<{ products: ProductCoverDimension[] }>} A promise that resolves with a list of cover dimensions.
   * Note: The API response structure is `ProductCoverDimension[]`, but the SDK wraps it in `{ products: ... }`. This might be an area for future alignment.
   * @see https://docs.gelato.com/reference/getproductcoverdimensions
   */
  getCoverDimensions(
    productUid: string,
    params: { pageCount: number },
  ): Promise<{ products: ProductCoverDimension[] }> {
    return this.handleResponse(this.axios.get<{ products: ProductCoverDimension[] }>(`/products/${productUid}/cover-dimensions`, { params }));
  }

  /**
   * Retrieves prices for a specific product.
   * @param {string} productUid - The unique identifier for the product.
   * @param {object} [params] - Optional parameters.
   * @param {string} [params.country] - The country code for which to get prices.
   * @param {string} [params.currency] - The currency code for the prices.
   * @param {number} [params.pageCount] - The page count, if applicable for the product.
   * @returns {Promise<ProductPrice[]>} A promise that resolves with a list of product prices.
   * @see https://docs.gelato.com/reference/getproductprices
   */
  getPrices(
    productUid: string,
    params?: { country?: string; currency?: string; pageCount?: number },
  ): Promise<ProductPrice[]> {
    return this.handleResponse(this.axios.get<ProductPrice[]>(`/products/${productUid}/prices`, { params }));
  }

  /**
   * Checks stock availability for a list of product UIDs.
   * Note: The current implementation uses the `/stock/region-availability` endpoint and sends an array of product UIDs.
   * The more common API for checking stock with quantities is usually `POST /v1/stock/products:check`.
   * This method might be using a specific or simplified internal endpoint.
   * @param {string[]} products - An array of product UIDs.
   * @returns {Promise<{ productsAvailability: ProductAvailability[] }>} A promise that resolves with the availability information for the products.
   */
  getStockAvailability(products: string[]): Promise<{ productsAvailability: ProductAvailability[] }> {
    return this.handleResponse(this.axios.post<{ productsAvailability: ProductAvailability[] }>(`/stock/region-availability`, { products }));
  }
}
