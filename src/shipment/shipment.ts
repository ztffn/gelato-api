import { GelatoApiBase } from '../base';
import { Config, ShipmentMethod } from '../types';

/**
 * Gelato Shipment API client.
 * Provides methods for interacting with Gelato's Shipment API, primarily for retrieving shipping methods.
 * Note: V4 of the Gelato API might offer more advanced shipment features.
 * Refer to ROADMAP.md for details on planned V4 integration.
 * @see https://docs.gelato.com/reference/shipping
 */
export class GelatoShipmentApi extends GelatoApiBase {
  // Note on baseUrl strategy:
  // The constructor does not pass a specific baseUrl to super(config, baseUrl).
  // Therefore, GelatoApiBase will use its own static default baseUrl (if defined)
  // or the static `baseUrl` from this derived class (`GelatoShipmentApi.baseUrl`) if the base's is undefined.
  // However, this class does not define its own `static baseUrl`.
  // Thus, it relies on `GelatoApiBase.baseUrl` or paths in methods being absolute or configured correctly at a higher level.
  // For `getMethods`, the path '/v1/shipping/methods' is used, which assumes a base URL like 'https://api.gelato.com'.
  // This was set as the static baseUrl in a previous version of this file but removed for clarity,
  // assuming GelatoApiBase handles the base URL correctly.

  /**
   * Constructs a new GelatoShipmentApi instance.
   * @param {Config} config - The configuration object including the API key.
   */
  constructor(config: Config) {
    super(config);
  }

  /**
   * Retrieves available shipping methods.
   * The API endpoint used is `/v1/shipping/methods`.
   * @param {object} [params] - Optional parameters to filter shipping methods.
   * @param {string} [params.country] - ISO 3166-1 alpha-2 country code to filter methods for.
   * @param {string} [params.currency] - ISO 4217 currency code to get prices in.
   * @returns {Promise<ShipmentMethod[]>} A promise that resolves with an array of available shipment methods.
   * @see https://docs.gelato.com/reference/getshippingmethods
   */
  getMethods(params?: { country?: string, currency?: string }): Promise<ShipmentMethod[]> {
    return this.handleResponse(this.axios.get<ShipmentMethod[]>('/v1/shipping/methods', { params }));
  }
}
