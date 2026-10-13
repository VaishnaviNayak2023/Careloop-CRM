import { WooCommerceCustomer, WooCommerceOrder } from './woocommerce.types';

export class WooCommerceMapper {
  /**
   * Map WooCommerce customer to CareLoop customer data
   */
  static mapCustomerToCRM(wooCustomer: WooCommerceCustomer) {
    const billing = wooCustomer.billing || {};
    const shipping = wooCustomer.shipping || {};

    return {
      name: `${wooCustomer.first_name} ${wooCustomer.last_name}`.trim() || wooCustomer.username || 'Customer',
      email: wooCustomer.email,
      phone: billing.phone || shipping.phone,
      company: billing.company || shipping.company,
      customerType: billing.company ? 'business' : 'individual',
      source: 'woocommerce',
      externalCustomerId: wooCustomer.id.toString(),
      externalEmail: wooCustomer.email
    };
  }

  /**
   * Map WooCommerce order to CareLoop order data
   */
  static mapOrderToCRM(wooOrder: WooCommerceOrder) {
    return {
      externalOrderId: wooOrder.id.toString(),
      externalOrderNumber: wooOrder.number,
      orderStatus: wooOrder.status,
      currency: wooOrder.currency,
      total: parseFloat(wooOrder.total),
      paymentMethod: wooOrder.payment_method,
      paymentStatus: this.determinePaymentStatus(wooOrder),
      billingAddress: JSON.stringify(wooOrder.billing),
      shippingAddress: JSON.stringify(wooOrder.shipping),
      lineItems: JSON.stringify(wooOrder.line_items),
      externalModifiedAt: wooOrder.date_modified
    };
  }

  /**
   * Determine payment status from WooCommerce order
   */
  private static determinePaymentStatus(order: WooCommerceOrder): string {
    const status = order.status.toLowerCase();
    if (status === 'completed' || status === 'processing') {
      return 'paid';
    } else if (status === 'pending' || status === 'on-hold') {
      return 'pending';
    } else if (status === 'cancelled' || status === 'refunded' || status === 'failed') {
      return status;
    }
    return 'unknown';
  }

  /**
   * Extract customer email from order (for guest checkout)
   */
  static extractCustomerEmailFromOrder(order: WooCommerceOrder): string {
    return order.billing.email || order.shipping.email || '';
  }

  /**
   * Extract customer name from order (for guest checkout)
   */
  static extractCustomerNameFromOrder(order: WooCommerceOrder): string {
    const billing = order.billing;
    return `${billing.first_name} ${billing.last_name}`.trim() || 'Guest Customer';
  }
}
