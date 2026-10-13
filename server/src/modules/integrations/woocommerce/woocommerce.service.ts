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

    // For demo, return mock sync result
    // In production, this would:
    // 1. Fetch customers from WooCommerce in pages
    // 2. Map to CRM format
    // 3. Create or update customer records
    // 4. Create external mappings
    // 5. Handle guest customers

    return {
      processed: 0,
      created: 0,
      updated: 0,
      skipped: 0,
      failed: 0
    };
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

    // For demo, return mock sync result
    // In production, this would:
    // 1. Fetch orders from WooCommerce in pages
    // 2. Map to CRM format
    // 3. Match to existing customers or create guest customer records
    // 4. Create order records
    // 5. Create external mappings
    // 6. Handle order updates

    return {
      processed: 0,
      created: 0,
      updated: 0,
      skipped: 0,
      failed: 0
    };
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
