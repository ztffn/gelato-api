import { GelatoApiBase } from './base';
import { Config } from './types';
import { GelatoOrdersApi } from './orders';
import { GelatoProductApi } from './products';
import { GelatoShipmentApi } from './shipment';

export class GelatoApi extends GelatoApiBase {
  readonly products: GelatoProductApi;
  readonly shipment: GelatoShipmentApi;
  readonly orders: GelatoOrdersApi;

  constructor(config: Config) {
    super(config, '');
    this.products = new GelatoProductApi(config);
    this.shipment = new GelatoShipmentApi(config);
    this.orders = new GelatoOrdersApi(config);
  }
}
