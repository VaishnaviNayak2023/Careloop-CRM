import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class OrderService {
  async getAllOrders() {
    return prisma.order.findMany({
      include: {
        customer: true,
        integration: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getOrderById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        integration: true,
        promises: {
          include: {
            assignee: { include: { user: true } }
          }
        }
      }
    });
  }

  async getOrdersByCustomer(customerId: string) {
    return prisma.order.findMany({
      where: { customerId },
      include: {
        integration: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createPromiseFromOrder(orderId: string, data: any, userId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true }
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return prisma.promise.create({
      data: {
        customerId: order.customerId!,
        orderId: order.id,
        title: data.title,
        description: data.description,
        dueAt: new Date(data.dueAt),
        status: 'OPEN',
        priority: data.priority || 'medium',
        createdBy: userId,
        assignedTo: data.assignedTo || userId
      },
      include: {
        customer: true,
        assignee: { include: { user: true } }
      }
    });
  }
}
