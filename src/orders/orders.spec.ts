import { GelatoOrdersApi } from './orders';
import { GelatoApiBase } from '../base';

describe('GelatoOrdersApi', () => {
  let ordersApi: GelatoOrdersApi;

  beforeEach(() => {
    ordersApi = new GelatoOrdersApi({ apiKey: 'test-key' });
  });

  it('should be an instance of GelatoApiBase', () => {
    expect(ordersApi).toBeInstanceOf(GelatoApiBase);
  });
});
