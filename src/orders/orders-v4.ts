import { GelatoApiBase } from '../base';
import { AxiosResponse } from 'axios';
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
  OrderPatchRequest,
  OrderQuoteResponse,
  ListResponse,
} from '../types';

/**
 * Gelato Orders API client.
 * Provides methods for interacting with the Gelato Orders API.
 * @see https://order.gelatoapis.com
 * @see Docs/APIv4/Gelato_API_1-2_Create_Orders.md
 * @see Docs/APIv4/Gelato_API_1-3_GetOrders.md
 * @see Docs/APIv4/Gelato_API_1-4_SearchOrders.md
 * @see Docs/APIv4/Gelato_API_1-5_CancelOrder.md
 * @see Docs/APIv4/Gelato_API_1-6_DeleteDraftOrder.md
 */
export class GelatoOrdersApi extends GelatoApiBase {
  /**
   * Constructs a new GelatoOrdersApi instance.
   * @param {Config} config - The configuration object including the API key.
   */
  constructor(config: Config) {
    super(config, 'https://order.gelatoapis.com');
  }

  /**
   * Creates a new order.
   * @param {OrderCreateRequest} order - The order details.
   * @returns {Promise<Order>} A promise that resolves with the created order.
   * @see Docs/APIv4/Gelato_API_1-2_Create_Orders.md
   */
  create(order: OrderCreateRequest): Promise<Order> {
    const promise: Promise<AxiosResponse<Order>> = this.axios.post<Order>('/orders', order);
    return this.handleResponse(promise);
  }

  /**
   * Retrieves an order by its ID.
   * @param {string} orderId - The unique identifier for the order.
   * @returns {Promise<Order>} A promise that resolves with the order details.
   * @see Docs/APIv4/Gelato_API_1-3_GetOrders.md
   */
  get(orderId: string): Promise<Order> {
    const promise: Promise<AxiosResponse<Order>> = this.axios.get<Order>(`/orders/${orderId}`);
    return this.handleResponse(promise);
  }

  /**
   * Patch a draft order (convert draft to order or update items)
   * @see Docs/APIv4/Gelato_API_1-3_GetOrders.md
   * @see Docs/APIv4/Gelato_API_1-5_CancelOrder.md
   */
  patch(orderId: string, data: Partial<Order>): Promise<Order> {
    const promise: Promise<AxiosResponse<Order>> = this.axios.patch<Order>(`/orders/${orderId}`, data);
    return this.handleResponse(promise);
  }

  /**
   * Deletes a draft order.
   * @param {string} orderId - The unique identifier for the order.
   * @returns {Promise<void>} A promise that resolves when the order is deleted.
   * @see Docs/APIv4/Gelato_API_1-6_DeleteDraftOrder.md
   */
  delete(orderId: string): Promise<void> {
    const promise: Promise<AxiosResponse<void>> = this.axios.delete<void>(`/orders/${orderId}`);
    return this.handleResponse(promise);
  }

  /**
   * Cancels an order.
   * @param {string} orderId - The unique identifier for the order.
   * @returns {Promise<Order>} A promise that resolves with the cancelled order.
   * @see Docs/APIv4/Gelato_API_1-5_CancelOrder.md
   */
  cancel(orderId: string): Promise<Order> {
    const promise: Promise<AxiosResponse<Order>> = this.axios.post<Order>(`/orders/${orderId}:cancel`);
    return this.handleResponse(promise);
  }

  /**
   * Searches for orders based on the provided criteria.
   * @param {OrderSearchRequest} params - The search parameters.
   * @returns {Promise<OrderSearch[]>} A promise that resolves with the search results.
   * @see Docs/APIv4/Gelato_API_1-4_SearchOrders.md
   */
  search(params: OrderSearchRequest): Promise<OrderSearch[]> {
    const promise: Promise<AxiosResponse<{ orders: OrderSearch[] }>> = this.axios.post<{ orders: OrderSearch[] }>('/orders:search', params);
    return this.handleResponse(promise).then(response => response.orders);
  }

  // getShippingAddress(orderId: string): Promise<OrderShippingAddress> { // Removed, shippingAddress is part of Order object in V4
  //   return this.handleResponse(this.axios.get(`${orderId}/shipping-address`));
  // }

  // updateShippingAddress(orderId: string, params: OrderShippingAddress): Promise<OrderShippingAddress> { // Removed, no direct V4 equivalent
  //   return this.handleResponse(this.axios.put(`${orderId}/shipping-address`, params));
  // }
}
