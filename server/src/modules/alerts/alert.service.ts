import { PrismaClient } from '@prisma/client';
import { PromiseService } from '../promises/promise.service';

const prisma = new PrismaClient();
const promiseService = new PromiseService();

export interface AttentionItem {
  customerId: string;
  customerName: string;
  reason: string;
  evidence: string;
  suggestedAction: string;
  responsibleAdmin?: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
}

export class AlertService {
  async getAttentionItems(): Promise<AttentionItem[]> {
    const attentionItems: AttentionItem[] = [];

    // Get overdue promises
    const overduePromises = await promiseService.getOverduePromises();
    for (const promise of overduePromises) {
      attentionItems.push({
        customerId: promise.customerId,
        customerName: promise.customer.name,
        reason: 'Overdue promise',
        evidence: `Promise "${promise.title}" was due on ${new Date(promise.dueAt).toLocaleDateString()}`,
        suggestedAction: 'Review promise and prepare update for customer',
        responsibleAdmin: promise.assignee.user.fullName,
        relatedEntityId: promise.id,
        relatedEntityType: 'Promise'
      });
    }

    // Get promises due today
    const dueTodayPromises = await promiseService.getDueTodayPromises();
    for (const promise of dueTodayPromises) {
      attentionItems.push({
        customerId: promise.customerId,
        customerName: promise.customer.name,
        reason: 'Promise due today',
        evidence: `Promise "${promise.title}" is due today`,
        suggestedAction: 'Complete or update the promise before end of day',
        responsibleAdmin: promise.assignee.user.fullName,
        relatedEntityId: promise.id,
        relatedEntityType: 'Promise'
      });
    }

    // Get customers with no recent interaction (14+ days)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const customersWithNoInteraction = await prisma.customer.findMany({
      where: {
        interactions: {
          none: {
            createdAt: { gte: fourteenDaysAgo }
          }
        }
      },
      include: {
        currentAssignment: {
          include: {
            admin: { include: { user: true } }
          }
        }
      }
    });

    for (const customer of customersWithNoInteraction) {
      attentionItems.push({
        customerId: customer.id,
        customerName: customer.name,
        reason: 'No recent interaction',
        evidence: `No interaction recorded in the last 14 days`,
        suggestedAction: 'Check in with customer to maintain relationship',
        responsibleAdmin: customer.currentAssignment?.admin.user.fullName
      });
    }

    return attentionItems;
  }

  async getDashboardMetrics() {
    const [
      totalCustomers,
      overduePromises,
      dueTodayPromises,
      fulfilledThisMonth,
      openRequests,
      attentionItems
    ] = await Promise.all([
      prisma.customer.count(),
      promiseService.getOverduePromises().then(p => p.length),
      promiseService.getDueTodayPromises().then(p => p.length),
      prisma.promise.count({
        where: {
          status: 'FULFILLED',
          completedAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30))
          }
        }
      }),
      prisma.supportRequest.count({
        where: { status: { in: ['OPEN', 'IN_PROGRESS'] } }
      }),
      this.getAttentionItems()
    ]);

    return {
      totalCustomers,
      promisesDueToday: dueTodayPromises,
      overduePromises,
      fulfilledThisMonth,
      openSupportRequests: openRequests,
      customersNeedingAttention: attentionItems.length
    };
  }
}
