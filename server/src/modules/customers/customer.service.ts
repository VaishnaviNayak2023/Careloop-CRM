import { PrismaClient } from '@prisma/client';
import { CreateCustomerInput, UpdateCustomerInput } from './customer.schema';

const prisma = new PrismaClient();

export class CustomerService {
  async getAllCustomers() {
    return prisma.customer.findMany({
      include: {
        currentAssignment: {
          include: {
            admin: {
              include: {
                user: true
              }
            }
          }
        },
        user: true
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async getCustomerById(id: string) {
    return prisma.customer.findUnique({
      where: { id },
      include: {
        currentAssignment: {
          include: {
            admin: {
              include: {
                user: true
              }
            }
          }
        },
        promises: {
          include: {
            creator: { include: { user: true } },
            assignee: { include: { user: true } }
          },
          orderBy: { dueAt: 'asc' }
        },
        interactions: {
          orderBy: { createdAt: 'desc' }
        },
        supportRequests: {
          orderBy: { createdAt: 'desc' }
        },
        user: true
      }
    });
  }

  async createCustomer(data: CreateCustomerInput, userId: string) {
    return prisma.customer.create({
      data: {
        ...data,
        userId,
        updatedBy: userId
      }
    });
  }

  async updateCustomer(id: string, data: UpdateCustomerInput, userId: string) {
    const customer = await prisma.customer.findUnique({ where: { id } });

    if (!customer) {
      throw new Error('Customer not found');
    }

    if (customer.version !== data.version) {
      throw new Error('Conflict: Customer has been modified by another user');
    }

    return prisma.customer.update({
      where: { id },
      data: {
        ...data,
        updatedBy: userId,
        version: { increment: 1 }
      }
    });
  }

  async getCustomerTimeline(customerId: string) {
    const [interactions, promises, requests] = await Promise.all([
      prisma.interaction.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.promise.findMany({
        where: { customerId },
        include: {
          creator: { include: { user: true } },
          assignee: { include: { user: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.supportRequest.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return {
      interactions,
      promises,
      requests
    };
  }
}
