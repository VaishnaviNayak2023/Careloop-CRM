import { PrismaClient } from '@prisma/client';
import { WooCommerceClient } from './woocommerce.client';
import { WooCommerceMapper } from './woocommerce.mapper';
import { ConnectIntegrationRequest, SyncRequest } from './woocommerce.types';
import crypto from 'crypto';

const prisma = new PrismaClient();

export class WooCommerceService {
  /**
   * Connect to a WooCommerce store
   */
  async connectIntegration(data: ConnectIntegrationRequest, userId: string) {
    // Validate store URL
    const storeUrl = this.normalizeStoreUrl(data.storeUrl);
    if (!this.isValidStoreUrl(storeUrl)) {
      throw new Error('Invalid store URL');
    }

    // Test connection
    const client = new WooCommerceClient({
      storeUrl,
      consumerKey: data.consumerKey,
      consumerSecret: data.consumerSecret
    });

    const isConnected = await client.testConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to WooCommerce store. Please check your credentials.');
    }

    // Encrypt credentials (simple hash for demo - use proper encryption in production)
    const credentialHash = crypto
      .createHash('sha256')
      .update(data.consumerSecret)
      .digest('hex');

    // Check if integration already exists
    const existing = await prisma.integration.findUnique({
      where: {
        provider_storeUrl: {
          provider: 'woocommerce',
          storeUrl
        }
      }
    });

    if (existing) {
      // Update existing
      return prisma.integration.update({
        where: { id: existing.id },
        data: {
          credentialHash,
          status: 'CONNECTED',
          lastSyncAt: null,
          updatedAt: new Date()
        }
      });
    }

    // Create new integration
    const integration = await prisma.integration.create({
      data: {
        provider: 'woocommerce',
        storeUrl,
        storeName: this.extractStoreName(storeUrl),
        credentialHash,
        status: 'CONNECTED',
        createdBy: userId
      }
    });

    // Trigger initial sync if requested
    if (data.importCustomers || data.importOrders) {
      // For demo, sync will be triggered manually
      console.log('Initial sync requested:', { importCustomers: data.importCustomers, importOrders: data.importOrders });
    }

    return integration;
  }

  /**
   * Get integration status
   */
  async getIntegrationStatus(integrationId: string) {
    const integration = await prisma.integration.findUnique({
      where: { id: integrationId },
      include: {
        _count: {
          select: {
            externalCustomerMappings: true,
            externalOrderMappings: true
          }
        }
      }
    });

    if (!integration) {
      throw new Error('Integration not found');
    }

    return {
      ...integration,
      importedCustomers: integration._count.externalCustomerMappings,
      importedOrders: integration._count.externalOrderMappings
    };
  }

  /**
   * Sync customers from WooCommerce
   */
  async syncCustomers(integrationId: string) {
    const integration = await prisma.integration.findUnique({
      where: { id: integrationId }
    });

    if (!integration) {
      throw new Error('Integration not found');
    }

    // Create sync job
    const syncJob = await prisma.syncJob.create({
      data: {
        integrationId,
        type: 'CUSTOMER_SYNC',
        status: 'RUNNING',
        startedAt: new Date()
      }
    });

    try {
      // In production, this would:
      // 1. Fetch customers from WooCommerce in pages
      // 2. Map to CRM format
      // 3. Create or update customer records
      // 4. Create external mappings
      // 5. Handle guest customers
      
      // For now, return job status
      await prisma.syncJob.update({
        where: { id: syncJob.id },
        data: {
          status: 'COMPLETED',
          finishedAt: new Date(),
          processedCount: 0,
          createdCount: 0,
          updatedCount: 0,
          skippedCount: 0,
          failedCount: 0
        }
      });

      return {
        processed: 0,
        created: 0,
        updated: 0,
        skipped: 0,
        failed: 0
      };
    } catch (error) {
      await prisma.syncJob.update({
        where: { id: syncJob.id },
        data: {
          status: 'FAILED',
          finishedAt: new Date(),
          errorSummary: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      throw error;
    }
  }

  /**
   * Sync orders from WooCommerce
   */
  async syncOrders(integrationId: string) {
    const integration = await prisma.integration.findUnique({
      where: { id: integrationId }
    });

    if (!integration) {
      throw new Error('Integration not found');
    }

    // Create sync job
    const syncJob = await prisma.syncJob.create({
      data: {
        integrationId,
        type: 'ORDER_SYNC',
        status: 'RUNNING',
        startedAt: new Date()
      }
    });

    try {
      // In production, this would:
      // 1. Fetch orders from WooCommerce in pages
      // 2. Map to CRM format
      // 3. Match to existing customers or create guest customer records
      // 4. Create order records
      // 5. Create external mappings
      // 6. Handle order updates
      
      // For now, return job status
      await prisma.syncJob.update({
        where: { id: syncJob.id },
        data: {
          status: 'COMPLETED',
          finishedAt: new Date(),
          processedCount: 0,
          createdCount: 0,
          updatedCount: 0,
          skippedCount: 0,
          failedCount: 0
        }
      });

      return {
        processed: 0,
        created: 0,
        updated: 0,
        skipped: 0,
        failed: 0
      };
    } catch (error) {
      await prisma.syncJob.update({
        where: { id: syncJob.id },
        data: {
          status: 'FAILED',
          finishedAt: new Date(),
          errorSummary: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      throw error;
    }
  }

  /**
   * Enable demo mode
   */
  async enableDemoMode(userId: string) {
    // Check if demo mode already exists
    const existing = await prisma.integration.findFirst({
      where: {
        provider: 'woocommerce',
        storeUrl: 'demo://woocommerce'
      }
    });

    if (existing) {
      return existing;
    }

    // Create demo integration
    const integration = await prisma.integration.create({
      data: {
        provider: 'woocommerce',
        storeUrl: 'demo://woocommerce',
        storeName: 'Demo WooCommerce Store',
        status: 'CONNECTED',
        createdBy: userId
      }
    });

    // Seed demo orders
    await this.seedDemoOrders(integration.id);

    return integration;
  }

  /**
   * Seed demo orders
   */
  private async seedDemoOrders(integrationId: string) {
    const demoOrders = [
      {
        externalOrderId: 'demo-1',
        externalOrderNumber: '1001',
        orderStatus: 'completed',
        currency: 'USD',
        total: 125.00,
        paymentMethod: 'stripe',
        paymentStatus: 'paid',
        billingAddress: JSON.stringify({
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1 555-0100'
        }),
        shippingAddress: JSON.stringify({
          first_name: 'John',
          last_name: 'Doe',
          address_1: '123 Main St',
          city: 'New York',
          state: 'NY',
          postcode: '10001',
          country: 'US'
        }),
        lineItems: JSON.stringify([
          { id: 1, name: 'Product A', quantity: 2, price: '50.00', total: '100.00' },
          { id: 2, name: 'Product B', quantity: 1, price: '25.00', total: '25.00' }
        ])
      },
      {
        externalOrderId: 'demo-2',
        externalOrderNumber: '1002',
        orderStatus: 'processing',
        currency: 'USD',
        total: 299.99,
        paymentMethod: 'paypal',
        paymentStatus: 'paid',
        billingAddress: JSON.stringify({
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane.smith@example.com',
          phone: '+1 555-0200'
        }),
        shippingAddress: JSON.stringify({
          first_name: 'Jane',
          last_name: 'Smith',
          address_1: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          postcode: '90001',
          country: 'US'
        }),
        lineItems: JSON.stringify([
          { id: 3, name: 'Product C', quantity: 1, price: '299.99', total: '299.99' }
        ])
      },
      {
        externalOrderId: 'demo-3',
        externalOrderNumber: '1003',
        orderStatus: 'pending',
        currency: 'USD',
        total: 75.50,
        paymentMethod: 'bacs',
        paymentStatus: 'pending',
        billingAddress: JSON.stringify({
          first_name: 'Bob',
          last_name: 'Johnson',
          email: 'bob.johnson@example.com',
          phone: '+1 555-0300'
        }),
        shippingAddress: JSON.stringify({
          first_name: 'Bob',
          last_name: 'Johnson',
          address_1: '789 Pine Rd',
          city: 'Chicago',
          state: 'IL',
          postcode: '60601',
          country: 'US'
        }),
        lineItems: JSON.stringify([
          { id: 4, name: 'Product D', quantity: 3, price: '25.00', total: '75.00' },
          { id: 5, name: 'Shipping', quantity: 1, price: '0.50', total: '0.50' }
        ])
      }
    ];

    // Create demo customers first
    const customers = await prisma.customer.findMany({
      where: { email: { in: ['john.doe@example.com', 'jane.smith@example.com', 'bob.johnson@example.com'] } }
    });

    const customerMap = new Map();
    for (const order of demoOrders) {
      const billing = JSON.parse(order.billingAddress);
      let customer = customers.find(c => c.email === billing.email);
      
      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            userId: (await prisma.user.findFirst({ where: { email: billing.email } }))?.id || '',
            name: `${billing.first_name} ${billing.last_name}`,
            email: billing.email,
            phone: billing.phone,
            customerType: 'individual',
            status: 'active',
            source: 'woocommerce-demo'
          }
        });
      }
      
      customerMap.set(order.externalOrderId, customer.id);
    }

    // Create orders
    for (const order of demoOrders) {
      const customerId = customerMap.get(order.externalOrderId);
      
      const createdOrder = await prisma.order.create({
        data: {
          integrationId,
          customerId,
          ...order
        }
      });

      // Create external mapping
      await prisma.externalOrderMapping.create({
        data: {
          integrationId,
          internalOrderId: createdOrder.id,
          externalOrderId: order.externalOrderId,
          externalOrderNumber: order.externalOrderNumber
        }
      });
    }

    // Update integration last sync
    await prisma.integration.update({
      where: { id: integrationId },
      data: { lastSyncAt: new Date() }
    });
  }

  /**
   * Disconnect integration
   */
  async disconnectIntegration(integrationId: string) {
    const integration = await prisma.integration.update({
      where: { id: integrationId },
      data: {
        status: 'DISCONNECTED',
        credentialHash: null,
        updatedAt: new Date()
      }
    });

    return integration;
  }

  /**
   * Normalize store URL
   */
  private normalizeStoreUrl(url: string): string {
    let normalized = url.trim();
    if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
      normalized = `https://${normalized}`;
    }
    normalized = normalized.replace(/\/$/, '');
    return normalized;
  }

  /**
   * Validate store URL
   */
  private isValidStoreUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      // Reject localhost, private IPs, etc. in production
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Extract store name from URL
   */
  private extractStoreName(url: string): string {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace('www.', '');
    } catch {
      return 'WooCommerce Store';
    }
  }
}
