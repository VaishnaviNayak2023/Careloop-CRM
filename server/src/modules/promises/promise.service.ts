import { PrismaClient } from '@prisma/client';
import { CreatePromiseInput, UpdatePromiseInput, FulfillPromiseInput } from './promise.schema';

const prisma = new PrismaClient();

export class PromiseService {
  async getAllPromises() {
    return prisma.promise.findMany({
      include: {
        customer: true,
        creator: { include: { user: true } },
        assignee: { include: { user: true } },
        completer: { include: { user: true } }
      },
      orderBy: { dueAt: 'asc' }
    });
  }

  async getPromiseById(id: string) {
    return prisma.promise.findUnique({
      where: { id },
      include: {
        customer: true,
        creator: { include: { user: true } },
        assignee: { include: { user: true } },
        completer: { include: { user: true } }
      }
    });
  }

  async createPromise(data: CreatePromiseInput, createdBy: string) {
    return prisma.promise.create({
      data: {
        ...data,
        dueAt: new Date(data.dueAt),
        createdBy,
        assignedTo: data.assignedTo
      },
      include: {
        customer: true,
        creator: { include: { user: true } },
        assignee: { include: { user: true } }
      }
    });
  }

  async updatePromise(id: string, data: UpdatePromiseInput, userId: string) {
    const promise = await prisma.promise.findUnique({ where: { id } });

    if (!promise) {
      throw new Error('Promise not found');
    }

    if (promise.version !== data.version) {
      throw new Error('Conflict: Promise has been modified by another user');
    }

    return prisma.promise.update({
      where: { id },
      data: {
        ...data,
        dueAt: data.dueAt ? new Date(data.dueAt) : undefined,
        version: { increment: 1 }
      },
      include: {
        customer: true,
        creator: { include: { user: true } },
        assignee: { include: { user: true } }
      }
    });
  }

  async fulfillPromise(id: string, data: FulfillPromiseInput, userId: string) {
    const promise = await prisma.promise.findUnique({ where: { id } });

    if (!promise) {
      throw new Error('Promise not found');
    }

    if (promise.version !== data.version) {
      throw new Error('Conflict: Promise has been modified by another user');
    }

    return prisma.promise.update({
      where: { id },
      data: {
        status: 'FULFILLED',
        completedAt: new Date(),
        completedBy: userId,
        version: { increment: 1 }
      },
      include: {
        customer: true,
        creator: { include: { user: true } },
        assignee: { include: { user: true } },
        completer: { include: { user: true } }
      }
    });
  }

  async getPromisesByCustomer(customerId: string) {
    return prisma.promise.findMany({
      where: { customerId },
      include: {
        creator: { include: { user: true } },
        assignee: { include: { user: true } },
        completer: { include: { user: true } }
      },
      orderBy: { dueAt: 'asc' }
    });
  }

  async getPromisesByStaff(staffId: string) {
    return prisma.promise.findMany({
      where: { assignedTo: staffId },
      include: {
        customer: true,
        creator: { include: { user: true } },
        assignee: { include: { user: true } },
        completer: { include: { user: true } }
      },
      orderBy: { dueAt: 'asc' }
    });
  }

  async getOverduePromises() {
    const now = new Date();
    return prisma.promise.findMany({
      where: {
        dueAt: { lt: now },
        status: { in: ['OPEN', 'IN_PROGRESS'] }
      },
      include: {
        customer: true,
        creator: { include: { user: true } },
        assignee: { include: { user: true } }
      },
      orderBy: { dueAt: 'asc' }
    });
  }

  async getDueTodayPromises() {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    return prisma.promise.findMany({
      where: {
        dueAt: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: { in: ['OPEN', 'IN_PROGRESS'] }
      },
      include: {
        customer: true,
        creator: { include: { user: true } },
        assignee: { include: { user: true } }
      },
      orderBy: { dueAt: 'asc' }
    });
  }
}
