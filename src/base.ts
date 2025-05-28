import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { Config } from './types';

export class GelatoApiBase {
  protected config: Config;
  protected axios: AxiosInstance;

  static readonly baseUrl?: string;

  constructor(config: Config, baseUrl?: string) {
    this.config = { ...config };
    this.axios = axios.create({
      baseURL: baseUrl ?? (this.constructor as typeof GelatoApiBase).baseUrl,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': this.config.apiKey,
      },
    });
  }

  /**
   * Handles the response from an Axios HTTP request.
   * It expects a Promise of an AxiosResponse and returns a Promise of the response data (type T).
   * This method standardizes error handling for API calls.
   *
   * In case of an error, it categorizes and logs the error, then throws a new, more specific error.
   * - API Errors (server responded with non-2xx status): Logs status and data, throws `Error("API Error: ${status} - ${data}")`.
   * - Network Errors (no response received): Logs message, throws `Error("Network Error: ${message}")`.
   * - Request Setup Errors (Axios error before request): Logs message, throws `Error("Axios Error: ${message}")`.
   * - Other Unexpected Errors: Logs message, throws `Error("Unexpected Error: ${message}")`.
   *
   * @template T The expected type of the data in the AxiosResponse.
   * @param {Promise<AxiosResponse<T>>} p The promise returned by an Axios request (e.g., `this.axios.get(...)`).
   * @returns {Promise<T>} A promise that resolves with the data from the response, or rejects with a detailed error.
   */
  protected async handleResponse<T>(p: Promise<AxiosResponse<T>>): Promise<T> {
    return p
      .then((r) => r.data)
      .catch((err: Error | AxiosError<any>) => { // Type the error parameter
        if (axios.isAxiosError(err)) { // Use Axios's type guard
          if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('API Error Status:', err.response.status);
            // Using JSON.stringify for data as it could be an object or other types
            console.error('API Error Data:', JSON.stringify(err.response.data, null, 2));
            throw new Error(`API Error: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
          } else if (err.request) {
            // The request was made but no response was received
            // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.error('Network Error (no response received):', err.message);
            // err.code can also be useful here, e.g., 'ECONNREFUSED'
            throw new Error(`Network Error: ${err.message}`);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Axios Error (request setup failed):', err.message);
            throw new Error(`Axios Error: ${err.message}`);
          }
        } else {
          // Non-Axios error
          console.error('Unexpected Error:', err.message);
          throw new Error(`Unexpected Error: ${err.message}`);
        }
      });
  }
}
