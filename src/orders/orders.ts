import { Config } from '../types';
import { GelatoOrdersApi as GelatoOrdersV4Api } from './orders-v4';

/**
 * Gelato Orders API client.
 * Provides methods for interacting with the Gelato Orders API.
 * @see https://docs.gelato.com/reference/orders-api-v4
 */
export class GelatoOrdersApi extends GelatoOrdersV4Api {
  /**
   * Constructs a new GelatoOrdersApi instance.
   * @param {Config} config - The configuration object including the API key.
   */
  constructor(config: Config) {
    super(config);
  }
}
