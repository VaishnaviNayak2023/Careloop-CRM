export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'MANAGER' | 'STAFF_ADMIN' | 'CUSTOMER';
  accountStatus: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  customerProfile?: Customer;
  staffProfile?: StaffAdmin;
}

export interface Customer {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  customerType: string;
  status: string;
  source: string;
  tags?: string;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
  version: number;
  currentAssignment?: Assignment;
  promises?: Promise[];
  interactions?: Interaction[];
  supportRequests?: SupportRequest[];
}

export interface StaffAdmin {
  id: string;
  userId: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  customerId: string;
  adminId: string;
  admin: {
    id: string;
    user: User;
  };
  assignedBy: string;
  startAt: string;
  endAt: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'EXPIRED' | 'TRANSFERRED' | 'CANCELLED';
  handoverNotes?: string;
  createdAt: string;
  endedAt?: string;
}

export interface Promise {
  id: string;
  customerId: string;
  customer: Customer;
  title: string;
  description: string;
  dueAt: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'FULFILLED' | 'CANCELLED';
  priority: string;
  createdBy: string;
  creator: {
    id: string;
    user: User;
  };
  assignedTo: string;
  assignee: {
    id: string;
    user: User;
  };
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  completedBy?: string;
  version: number;
}

export interface Interaction {
  id: string;
  customerId: string;
  type: string;
  summary: string;
  details?: string;
  authorId?: string;
  authorName?: string;
  isInternal: boolean;
  createdAt: string;
}

export interface SupportRequest {
  id: string;
  customerId: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CUSTOMER' | 'RESOLVED';
  priority: string;
  assignedTo?: string;
  assignee?: {
    id: string;
    user: User;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  customerVisible: boolean;
  version: number;
}

export interface ActivityEvent {
  id: string;
  actorId: string;
  actor: User;
  entityType: string;
  entityId: string;
  action: string;
  timestamp: string;
  changes?: string;
  correlationId?: string;
}
