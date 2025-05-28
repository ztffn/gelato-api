import { GelatoApiBase } from '../base'; // GelatoOrdersV4Api will extend this
import { Gelato as I } from '../types';
import { GelatoOrdersV4Api } from './orders-v4';

// GelatoOrdersApi now directly IS the V4 implementation by extending GelatoOrdersV4Api.
// GelatoOrdersV4Api should extend GelatoApiBase, which is standard.
export class GelatoOrdersApi extends GelatoOrdersV4Api {
  constructor(config: I.Config) {
    super(config);
    // All methods and properties from GelatoOrdersV4Api are inherited.
    // No need to instantiate v4 separately if this class becomes the v4 wrapper.
  }
}
