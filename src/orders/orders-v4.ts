import { GelatoApiBase } from '../base';
import { Gelato as I } from '../types';

export class GelatoOrdersV4Api extends GelatoApiBase {
  static baseUrl = 'https://order.gelatoapis.com/v4/orders';

  constructor(config: I.Config) {
    super(config);
  }

  create(order: I.OrderCreateRequest): Promise<I.Order> {
    return this.handleResponse(this.axios.post('/', order));
  }

  get(orderId: string): Promise<I.Order> {
    return this.handleResponse(this.axios.get(orderId));
  }

  // update(order: I.Order): Promise<I.Order> { // Not available in V4, use patch for specific updates
  //   return this.handleResponse(this.axios.put(order.id, order));
  // }

  delete(orderId: string): Promise<void> {
    // Renamed from deleteDraft
    return this.handleResponse(this.axios.delete(orderId));
  }

  patch(orderId: string, params: I.OrderPatchRequest): Promise<I.Order> {
    // Renamed from patchDraft, params type updated
    return this.handleResponse(this.axios.patch(orderId, params));
  }

  cancel(orderId: string): Promise<void> {
    return this.handleResponse(this.axios.post(`${orderId}:cancel`));
  }

  search(params: I.OrderSearchRequest): Promise<I.OrderSearchListResponse> {
    // Return type updated
    return this.handleResponse(this.axios.post(`${GelatoOrdersV4Api.baseUrl}:search`, params));
  }

  quote(params: I.OrderQuoteRequest): Promise<I.OrderQuoteResponse> {
    // Return type updated
    return this.handleResponse(this.axios.post(`${GelatoOrdersV4Api.baseUrl}:quote`, params));
  }

  // getShippingAddress(orderId: string): Promise<I.OrderShippingAddress> { // Removed, shippingAddress is part of Order object in V4
  //   return this.handleResponse(this.axios.get(`${orderId}/shipping-address`));
  // }

  // updateShippingAddress(orderId: string, params: I.OrderShippingAddress): Promise<I.OrderShippingAddress> { // Removed, no direct V4 equivalent
  //   return this.handleResponse(this.axios.put(`${orderId}/shipping-address`, params));
  // }
}
