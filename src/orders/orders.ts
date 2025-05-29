import { Config } from '../types';
import { GelatoOrdersApi as GelatoOrdersV4Api } from './orders-v4';
import { GelatoOrdersV3Api } from './orders-v3';
import { OrderQuoteRequest, OrderQuoteResponse } from '../types';

/**
 * Gelato Orders API client.
 * Provides methods for interacting with the Gelato Orders API.
 * @see https://docs.gelato.com/reference/orders-api-v4
 */
export class GelatoOrdersApi extends GelatoOrdersV4Api {
  private v3Api: GelatoOrdersV3Api;

  /**
   * Constructs a new GelatoOrdersApi instance.
   * @param {Config} config - The configuration object including the API key.
   */
  constructor(config: Config) {
    super(config);
    this.v3Api = new GelatoOrdersV3Api(config);
  }

  /**
   * Retrieves a quote for an order.
   * @param {OrderQuoteRequest} params - The quote request parameters.
   * @returns {Promise<OrderQuoteResponse>} A promise that resolves with the quote details.
   * @see https://docs.gelato.com/reference/getorderquotes
   */
  quote(params: OrderQuoteRequest): Promise<OrderQuoteResponse> {
    return this.v3Api.quote(params);
  }
}
