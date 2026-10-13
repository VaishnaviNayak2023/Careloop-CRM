import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';
import { WooCommerceCredentials, WooCommerceCustomer, WooCommerceOrder, WooCommercePaginatedResponse } from './woocommerce.types';

export class WooCommerceClient {
  private client: AxiosInstance;
  private credentials: WooCommerceCredentials;

  constructor(credentials: WooCommerceCredentials) {
    this.credentials = credentials;
    this.client = axios.create({
      baseURL: `${credentials.storeUrl}/wp-json/wc/v3`,
      auth: {
        username: credentials.consumerKey,
        password: credentials.consumerSecret
      },
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.get('/system_status');
      return response.status === 200;
    } catch (error) {
      console.error('WooCommerce connection test failed:', error);
      return false;
    }
  }

  async getCustomers(page: number = 1, perPage: number = 100): Promise<WooCommercePaginatedResponse<WooCommerceCustomer>> {
    const response = await this.client.get('/customers', {
      params: { page, per_page: perPage }
    });

    return {
      data: response.data,
      headers: {
        'x-wp-total': response.headers['x-wp-total'] || '0',
        'x-wp-totalpages': response.headers['x-wp-totalpages'] || '0'
      }
    };
  }

  async getCustomer(id: number): Promise<WooCommerceCustomer> {
    const response = await this.client.get(`/customers/${id}`);
    return response.data;
  }

  async getOrders(page: number = 1, perPage: number = 100, after?: string): Promise<WooCommercePaginatedResponse<WooCommerceOrder>> {
    const params: any = { page, per_page: perPage };
    if (after) {
      params.after = after;
    }

    const response = await this.client.get('/orders', { params });

    return {
      data: response.data,
      headers: {
        'x-wp-total': response.headers['x-wp-total'] || '0',
        'x-wp-totalpages': response.headers['x-wp-totalpages'] || '0'
      }
    };
  }

  async getOrder(id: number): Promise<WooCommerceOrder> {
    const response = await this.client.get(`/orders/${id}`);
    return response.data;
  }

  /**
   * Verify webhook signature
   * WooCommerce webhooks use HMAC-SHA256 signature
   */
  static verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const digest = hmac.digest('base64');
    return digest === signature;
  }
}
