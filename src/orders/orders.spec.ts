import { GelatoOrdersApi } from './orders';
import { GelatoOrdersV3Api } from './orders-v3';
import { GelatoApiBase } from '../base';

describe('GelatoOrdersApi', () => {
  let ordersApi: GelatoOrdersApi;
  const mockApiKey = 'test-api-key';

  beforeEach(() => {
    const client = new GelatoApiBase({ apiKey: mockApiKey });
    ordersApi = new GelatoOrdersApi(client);
  });

  it('should be an instance of GelatoOrdersApi', () => {
    expect(ordersApi).toBeInstanceOf(GelatoOrdersApi);
  });

  it('should have a v3 property that is an instance of GelatoOrdersV3Api', () => {
    expect(ordersApi.v3).toBeInstanceOf(GelatoOrdersV3Api);
  });
});
