import { GelatoApiBase } from '../base';
import { AxiosResponse } from 'axios';
import { Config, ShipmentMethod } from '../types';

interface ListResponse<T> {
  data: T[];
  pagination: { total: number; offset: number };
}

/**
 * Gelato Shipment API client.
 * Provides methods for interacting with the Gelato Shipment API.
 * @see https://dashboard.gelato.com/docs/shipment/methods/
 * @see Docs/APIv4/Gelato_API_3-1_Shipment.md
 */
export class GelatoShipmentApi extends GelatoApiBase {
  /**
   * Constructs a new GelatoShipmentApi instance.
   * @param {Config} config - The configuration object including the API key.
   */
  constructor(config: Config) {
    super(config, 'https://order.gelatoapis.com');
  }

  /**
   * Retrieves available shipping methods.
   * @param {string} [country] - Optional destination country ISO code.
   * @returns {Promise<ShipmentMethod[]>} A promise that resolves with the available shipping methods.
   * @see Docs/APIv4/Gelato_API_3-1_Shipment.md
   */
  getMethods(country?: string): Promise<ShipmentMethod[]> {
    const promise: Promise<AxiosResponse<{ shipmentMethods: ShipmentMethod[] }>> = this.axios.get<{ shipmentMethods: ShipmentMethod[] }>('/shipment-methods', {
      params: { country }
    });
    return this.handleResponse(promise).then(response => response.shipmentMethods);
  }
}
