import { GelatoApiBase } from '../base';
import { AxiosResponse } from 'axios';
import {
  Config,
  OrderCreateRequest,
  Order,
  OrderSearchRequest,
  OrderSearch,
  OrderQuoteRequest,
  OrderShippingAddress,
  PatchOperation,
  OrderQuoteResponse,
  OrderPatchRequest,
} from '../types';

// Define a generic ListResponse if not already suitable in types.ts
interface ListResponse<T> {
  data: T[];
  pagination: { total: number; offset: number };
}

/**
 * Gelato Orders API V3 client.
 * Provides methods for interacting with the Gelato Orders API (V3).
 * @see https://docs.gelato.com/reference/orders-api-v3
 */
export class GelatoOrdersV3Api extends GelatoApiBase {
  /**
   * Constructs a new GelatoOrdersV3Api instance.
   * @param {Config} config - The configuration object including the API key.
   */
  constructor(config: Config) {
    super(config, 'https://order.gelatoapis.com'); // Pass base URL for V3 orders
  }

  /**
   * Creates a new order.
   * @param {OrderCreateRequest} order - The order creation request payload.
   * @returns {Promise<Order>} A promise that resolves with the created order details.
   * @see https://docs.gelato.com/reference/createorder
   */
  create(order: OrderCreateRequest): Promise<Order> {
    const promise: Promise<AxiosResponse<Order>> = this.axios.post<Order>('/v3/orders', order);
    return this.handleResponse(promise);
  }

  /**
   * Retrieves an order by its ID.
   * @param {string} orderId - The unique identifier for the order.
   * @returns {Promise<Order>} A promise that resolves with the order details.
   * @see https://docs.gelato.com/reference/getorderbyid
   */
  get(orderId: string): Promise<Order> {
    const promise: Promise<AxiosResponse<Order>> = this.axios.get<Order>(`/v3/orders/${orderId}`);
    return this.handleResponse(promise);
  }

  /**
   * Updates an existing order.
   * Note: For V4 API, full order updates on confirmed orders might not be supported.
   * Consider cancel and recreate for significant changes, or PATCH for minor attributes.
   * See ROADMAP.md for more V4 considerations.
   * @param {string} orderId - The ID of the order to update.
   * @param {Partial<Order>} orderData - The partial order data to update.
   * @returns {Promise<Order>} A promise that resolves with the updated order details.
   * @see https://docs.gelato.com/reference/replaceorderbyid
   */
  update(orderId: string, orderData: Partial<Order>): Promise<Order> {
    const promise: Promise<AxiosResponse<Order>> = this.axios.put<Order>(`/v3/orders/${orderId}`, orderData);
    return this.handleResponse(promise);
  }

  /**
   * Patches a draft order. Allows partial updates to a draft order.
   * @param {string} orderId - The ID of the draft order to patch.
   * @param {PatchOperation[]} operations - An array of JSON Patch operations.
   * @returns {Promise<Order>} A promise that resolves with the patched order details.
   * @see https://docs.gelato.com/reference/updateorderdraft
   */
  patchDraft(orderId: string, operations: PatchOperation[]): Promise<Order> {
    const promise: Promise<AxiosResponse<Order>> = this.axios.patch<Order>(`/v3/orders/draft/${orderId}`, operations);
    return this.handleResponse(promise);
  }
  
  /**
   * Deletes a draft order.
   * @param {string} orderId - The ID of the draft order to delete.
   * @returns {Promise<void>} A promise that resolves when the draft order is successfully deleted.
   * @see https://docs.gelato.com/reference/deleteorderdraft
   */
  deleteDraft(orderId: string): Promise<void> {
    const promise: Promise<AxiosResponse<void>> = this.axios.delete<void>(`/v3/orders/draft/${orderId}`);
    return this.handleResponse(promise);
  }

  /**
   * Cancels an order.
   * @param {string} orderId - The ID of the order to cancel.
   * @returns {Promise<void>} A promise that resolves when the order is successfully canceled.
   * @see https://docs.gelato.com/reference/cancelorderbyid
   */
  cancel(orderId: string): Promise<void> {
    const promise: Promise<AxiosResponse<void>> = this.axios.post<void>(`/v3/orders/${orderId}:cancel`, {});
    return this.handleResponse(promise);
  }

  /**
   * Searches for orders based on specified criteria.
   * @param {OrderSearchRequest} params - The search parameters.
   * @returns {Promise<ListResponse<OrderSearch>>} A promise that resolves with a list of orders and pagination details.
   * @see https://docs.gelato.com/reference/searchorders
   */
  search(params: OrderSearchRequest): Promise<ListResponse<OrderSearch>> {
    const promise: Promise<AxiosResponse<ListResponse<OrderSearch>>> = this.axios.get<ListResponse<OrderSearch>>('/v3/orders', { params });
    return this.handleResponse(promise);
  }

  /**
   * Retrieves a quote for an order.
   * @param {OrderQuoteRequest} params - The quote request parameters.
   * @returns {Promise<OrderQuoteResponse>} A promise that resolves with the quote details.
   * @see https://docs.gelato.com/reference/getorderquotes
   */
  quote(params: OrderQuoteRequest): Promise<OrderQuoteResponse> {
    const promise: Promise<AxiosResponse<OrderQuoteResponse>> = this.axios.post<OrderQuoteResponse>('/v4/orders:quote', params);
    return this.handleResponse(promise);
  }

  /**
   * Retrieves the shipping address for an order.
   * @param {string} orderId - The ID of the order.
   * @returns {Promise<OrderShippingAddress>} A promise that resolves with the shipping address details.
   * @see https://docs.gelato.com/reference/getshippingaddressbyorderid
   */
  getShippingAddress(orderId: string): Promise<OrderShippingAddress> {
    const promise: Promise<AxiosResponse<OrderShippingAddress>> = this.axios.get<OrderShippingAddress>(`/v3/orders/${orderId}/shipping-address`);
    return this.handleResponse(promise);
  }

  /**
   * Updates the shipping address for an order.
   * Note: For V4 API, this functionality is expected to use a PATCH request.
   * See ROADMAP.md for more V4 considerations.
   * @param {string} orderId - The ID of the order.
   * @param {OrderShippingAddress} params - The new shipping address details.
   * @returns {Promise<OrderShippingAddress>} A promise that resolves with the updated shipping address details.
   * @see https://docs.gelato.com/reference/updateshippingaddressbyorderid
   */
  updateShippingAddress(orderId: string, params: OrderShippingAddress): Promise<OrderShippingAddress> {
    const promise: Promise<AxiosResponse<OrderShippingAddress>> = this.axios.put<OrderShippingAddress>(`/v3/orders/${orderId}/shipping-address`, params);
    return this.handleResponse(promise);
  }

  /**
   * Patches an existing order.
   * @param {string} orderId - The ID of the order to patch.
   * @param {OrderPatchRequest} patch - The patch request payload.
   * @returns {Promise<Order>} A promise that resolves with the patched order details.
   * @see https://docs.gelato.com/reference/updateorderbyid
   */
  patch(orderId: string, patch: OrderPatchRequest): Promise<Order> {
    const promise: Promise<AxiosResponse<Order>> = this.axios.patch<Order>(`/v3/orders/${orderId}`, patch);
    return this.handleResponse(promise);
  }

  /**
   * Deletes an existing order.
   * @param {string} orderId - The ID of the order to delete.
   * @returns {Promise<void>} A promise that resolves when the order is successfully deleted.
   * @see https://docs.gelato.com/reference/deleteorderbyid
   */
  delete(orderId: string): Promise<void> {
    const promise: Promise<AxiosResponse<void>> = this.axios.delete<void>(`/v3/orders/${orderId}`);
    return this.handleResponse(promise);
  }
}
