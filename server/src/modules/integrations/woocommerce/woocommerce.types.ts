// WooCommerce API Types
export interface WooCommerceCredentials {
  storeUrl: string;
  consumerKey: string;
  consumerSecret: string;
}

export interface WooCommerceCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username?: string;
  billing?: {
    first_name: string;
    last_name: string;
    company?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    email?: string;
    phone?: string;
  };
  shipping?: {
    first_name: string;
    last_name: string;
    company?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  date_created: string;
  date_modified: string;
}

export interface WooCommerceOrder {
  id: number;
  number: string;
  status: string;
  currency: string;
  total: string;
  payment_method?: string;
  payment_method_title?: string;
  date_created: string;
  date_modified: string;
  customer_id?: number;
  billing: {
    first_name: string;
    last_name: string;
    company?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    email?: string;
    phone?: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    company?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  line_items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: string;
    total: string;
  }>;
}

export interface WooCommercePaginatedResponse<T> {
  data: T[];
  headers: {
    'x-wp-total': string;
    'x-wp-totalpages': string;
  };
}

export interface ConnectIntegrationRequest {
  storeUrl: string;
  consumerKey: string;
  consumerSecret: string;
  importCustomers?: boolean;
  importOrders?: boolean;
  importProducts?: boolean;
}

export interface SyncRequest {
  integrationId: string;
  type?: 'full' | 'customers' | 'orders';
}

export interface WebhookEvent {
  id: number;
  topic: string;
  hook: string;
  delivery_url: string;
  resource: string;
  action: string;
  date: string;
  api_version: string;
  args: any;
}
