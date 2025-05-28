import { GelatoOrdersV3Api } from './orders-v3';
import { GelatoApiBase } from '../base';
import { Config } from '../types';

/**
 * Main class for interacting with Gelato's Orders API.
 * It provides access to different versions of the Orders API.
 * Currently, it primarily exposes the V3 Orders API.
 */
export class GelatoOrdersApi extends GelatoApiBase {
  /**
   * An instance of GelatoOrdersV3Api for interacting with V3 of the Orders API.
   * @type {GelatoOrdersV3Api}
   */
  readonly v3: GelatoOrdersV3Api;

  /**
   * Constructs a new GelatoOrdersApi instance.
   * @param {Config} config - The configuration object, including the API key.
   *                         This config is passed down to the underlying API version clients.
   */
  constructor(config: Config) {
    super(config); // GelatoApiBase constructor will set up the axios instance.
    // Pass the same config (which includes the API key and any other base settings)
    // to the V3 API client. The V3 client will then set its specific base URL.
    this.v3 = new GelatoOrdersV3Api(config); 
  }
}
