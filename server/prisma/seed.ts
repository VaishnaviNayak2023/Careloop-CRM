import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Hash passwords
  const passwordHash = await bcrypt.hash('demo123', 10);

  // Create users
  const manager = await prisma.user.upsert({
    where: { email: 'manager@careloop.com' },
    update: {},
    create: {
      email: 'manager@careloop.com',
      passwordHash,
      fullName: 'Sarah Johnson',
      role: 'MANAGER',
      accountStatus: 'ACTIVE',
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: 'staff@careloop.com' },
    update: {},
    create: {
      email: 'staff@careloop.com',
      passwordHash,
      fullName: 'Asha Patel',
      role: 'STAFF_ADMIN',
      accountStatus: 'ACTIVE',
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@careloop.com' },
    update: {},
    create: {
      email: 'customer@careloop.com',
      passwordHash,
      fullName: 'Priya Sharma',
      role: 'CUSTOMER',
      accountStatus: 'ACTIVE',
    },
  });

  // Create staff profile
  await prisma.staffAdmin.upsert({
    where: { userId: staff.id },
    update: {},
    create: {
      userId: staff.id,
      department: 'Customer Success',
    },
  });

  // Create customer profile
  const customerProfile = await prisma.customer.upsert({
    where: { userId: customer.id },
    update: {},
    create: {
      userId: customer.id,
      name: 'Priya Sharma',
      email: 'customer@careloop.com',
      phone: '+1 555-0123',
      company: 'Tech Solutions Inc',
      customerType: 'business',
      status: 'active',
      source: 'website',
    },
  });

  // Create additional customers
  const customer2 = await prisma.customer.create({
    data: {
      userId: (await prisma.user.create({
        data: {
          email: 'john@example.com',
          passwordHash,
          fullName: 'John Smith',
          role: 'CUSTOMER',
          accountStatus: 'ACTIVE',
        },
      })).id,
      name: 'John Smith',
      email: 'john@example.com',
      company: 'ABC Corp',
      customerType: 'business',
      status: 'active',
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      userId: (await prisma.user.create({
        data: {
          email: 'emma@example.com',
          passwordHash,
          fullName: 'Emma Davis',
          role: 'CUSTOMER',
          accountStatus: 'ACTIVE',
        },
      })).id,
      name: 'Emma Davis',
      email: 'emma@example.com',
      company: 'Startup XYZ',
      customerType: 'individual',
      status: 'active',
    },
  });

  // Create assignment
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const staffProfile2 = await prisma.staffAdmin.findFirst({
    where: { userId: staff.id },
  });

  if (staffProfile2) {
    await prisma.assignment.create({
      data: {
        customerId: customerProfile.id,
        adminId: staffProfile2.id,
        assignedBy: staffProfile2.id,
        startAt: today,
        endAt: nextWeek,
        status: 'ACTIVE',
      },
    });
  }

  // Create promises
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  if (staffProfile2) {
    // Overdue promise
    await prisma.promise.create({
      data: {
        customerId: customerProfile.id,
        title: 'Send quotation',
        description: 'Prepare and send the revised quotation for Q4 services',
        dueAt: yesterday,
        status: 'OPEN',
        priority: 'high',
        createdBy: staffProfile2.id,
        assignedTo: staffProfile2.id,
      },
    });

    // Due today
    await prisma.promise.create({
      data: {
        customerId: customer2.id,
        title: 'Confirm delivery date',
        description: 'Confirm the delivery date for the order',
        dueAt: today,
        status: 'OPEN',
        priority: 'medium',
        createdBy: staffProfile2.id,
        assignedTo: staffProfile2.id,
      },
    });

    // Upcoming
    await prisma.promise.create({
      data: {
        customerId: customer3.id,
        title: 'Schedule follow-up call',
        description: 'Schedule a follow-up call to discuss new requirements',
        dueAt: tomorrow,
        status: 'OPEN',
        priority: 'low',
        createdBy: staffProfile2.id,
        assignedTo: staffProfile2.id,
      },
    });

    // Fulfilled
    await prisma.promise.create({
      data: {
        customerId: customerProfile.id,
        title: 'Send invoice',
        description: 'Send the invoice for September services',
        dueAt: new Date(today.getTime() - 48 * 60 * 60 * 1000),
        status: 'FULFILLED',
        priority: 'medium',
        createdBy: staffProfile2.id,
        assignedTo: staffProfile2.id,
        completedAt: new Date(today.getTime() - 24 * 60 * 60 * 1000),
        completedBy: staffProfile2.id,
      },
    });
  }

  // Create interactions
  await prisma.interaction.create({
    data: {
      customerId: customerProfile.id,
      type: 'call',
      summary: 'Initial consultation call',
      details: 'Discussed Q4 service requirements and pricing',
      authorName: 'Asha Patel',
      isInternal: true,
    },
  });

  await prisma.interaction.create({
    data: {
      customerId: customer2.id,
      type: 'email',
      summary: 'Order confirmation received',
      details: 'Customer confirmed the order details',
      authorName: 'Asha Patel',
      isInternal: true,
    },
  });

  // Create support requests
  await prisma.supportRequest.create({
    data: {
      customerId: customerProfile.id,
      subject: 'Payment invoice question',
      description: 'Customer has questions about the September invoice',
      status: 'OPEN',
      priority: 'medium',
      customerVisible: true,
    },
  });

  const resolvedRequest = await prisma.supportRequest.create({
    data: {
      customerId: customer2.id,
      subject: 'Delivery inquiry',
      description: 'Customer asking about delivery status',
      status: 'RESOLVED',
      priority: 'low',
      customerVisible: true,
      resolvedAt: new Date(today.getTime() - 24 * 60 * 60 * 1000),
    },
  });

  if (staffProfile2) {
    await prisma.supportRequest.update({
      where: { id: resolvedRequest.id },
      data: {
        assignedTo: staffProfile2.id,
      },
    });
  }

  // Create activity events
  await prisma.activityEvent.create({
    data: {
      actorId: manager.id,
      entityType: 'User',
      entityId: staff.id,
      action: 'STAFF_APPROVED',
      changes: JSON.stringify({ role: 'STAFF_ADMIN', status: 'ACTIVE' }),
    },
  });

  await prisma.activityEvent.create({
    data: {
      actorId: staff.id,
      entityType: 'Promise',
      entityId: 'promise-1',
      action: 'PROMISE_CREATED',
      changes: JSON.stringify({ title: 'Send quotation' }),
    },
  });

  console.log('Seed completed successfully!');
  console.log('\nDemo accounts:');
  console.log('Manager: manager@careloop.com / demo123');
  console.log('Staff: staff@careloop.com / demo123');
  console.log('Customer: customer@careloop.com / demo123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
