import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Config } from './types';

/**
 * Base class for Gelato API clients.
 * Provides common functionality for making API requests.
 */
export class GelatoApiBase {
  protected axios: AxiosInstance;

  /**
   * Constructs a new GelatoApiBase instance.
   * @param {Config} config - The configuration object including the API key.
   * @param {string} baseUrl - The base URL for the API.
   */
  constructor(config: Config, baseUrl: string) {
    this.axios = axios.create({
      baseURL: baseUrl,
      headers: {
        'X-API-KEY': config.apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Handles API responses and errors.
   * @param {Promise<AxiosResponse<T>>} promise - The axios promise to handle.
   * @returns {Promise<T>} A promise that resolves with the response data or rejects with an error.
   */
  protected async handleResponse<T>(promise: Promise<AxiosResponse<T>>): Promise<T> {
    return promise
      .then((response) => {
        console.log('Response:', response.data);
        return response.data;
      })
      .catch((error) => {
        console.error('Request failed:', error.config);
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || error.message;
          throw new Error(`API Error: ${message}`);
        }
        throw error;
      });
  }
}
