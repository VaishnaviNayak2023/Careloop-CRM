import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ReplyDraftRequest {
  customerId: string;
  promiseId?: string;
  supportRequestId?: string;
  orderId?: string;
  tone: 'professional' | 'friendly' | 'apologetic' | 'concise';
}

export interface ReplyDraftResponse {
  draft: string;
  context: {
    customerName: string;
    relevantPromise?: string;
    relevantRequest?: string;
    relevantOrder?: string;
    tone: string;
  };
  isAIGenerated: boolean;
}

export class AIService {
  async generateReplyDraft(request: ReplyDraftRequest): Promise<ReplyDraftResponse> {
    const customer = await prisma.customer.findUnique({
      where: { id: request.customerId }
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    let relevantPromise: any = null;
    let relevantRequest: any = null;
    let relevantOrder: any = null;

    if (request.promiseId) {
      relevantPromise = await prisma.promise.findUnique({
        where: { id: request.promiseId },
        include: { assignee: { include: { user: true } } }
      });
    }

    if (request.supportRequestId) {
      relevantRequest = await prisma.supportRequest.findUnique({
        where: { id: request.supportRequestId }
      });
    }

    if (request.orderId) {
      relevantOrder = await prisma.order.findUnique({
        where: { id: request.orderId }
      });
    }

    // Template-based fallback (clearly labeled as not AI-generated)
    const draft = this.generateTemplateDraft(customer, relevantPromise, relevantRequest, relevantOrder, request.tone);

    return {
      draft,
      context: {
        customerName: customer.name,
        relevantPromise: relevantPromise?.title,
        relevantRequest: relevantRequest?.subject,
        relevantOrder: relevantOrder ? `Order #${relevantOrder.externalOrderNumber}` : undefined,
        tone: request.tone
      },
      isAIGenerated: false
    };
  }

  private generateTemplateDraft(
    customer: any,
    promise: any,
    request: any,
    order: any,
    tone: string
  ): string {
    const customerName = customer.name;

    const tonePrefixes = {
      professional: 'Dear',
      friendly: 'Hi',
      apologetic: 'Dear',
      concise: 'Hi'
    };

    const greeting = `${tonePrefixes[tone as keyof typeof tonePrefixes]} ${customerName},`;

    if (promise) {
      const dueDate = new Date(promise.dueAt).toLocaleDateString();
      const assignee = promise.assignee?.user?.fullName || 'our team';

      switch (tone) {
        case 'professional':
          return `${greeting}\n\nI am writing to provide an update regarding your promise: "${promise.title}".\n\nWe are currently working on this and will ensure it is completed by the due date of ${dueDate}.\n\nPlease let us know if you have any questions.\n\nBest regards,\n${assignee}`;

        case 'friendly':
          return `${greeting}!\n\nJust wanted to check in about "${promise.title}". We're on it and will have it ready by ${dueDate}.\n\nLet me know if you need anything else!\n\nCheers,\n${assignee}`;

        case 'apologetic':
          return `${greeting}\n\nI sincerely apologize for the delay regarding "${promise.title}". We understand this is important to you and we are prioritizing its completion.\n\nWe will ensure it is fulfilled as soon as possible. Thank you for your patience.\n\nSincerely,\n${assignee}`;

        case 'concise':
          return `${greeting}\n\nUpdate on "${promise.title}": In progress, due ${dueDate}.\n\nBest,\n${assignee}`;

        default:
          return `${greeting}\n\nRegarding "${promise.title}", we are working on it and will complete it by ${dueDate}.\n\nBest regards,\n${assignee}`;
      }
    }

    if (request) {
      switch (tone) {
        case 'professional':
          return `${greeting}\n\nThank you for your inquiry regarding "${request.subject}". We have received your request and are currently reviewing it.\n\nWe will get back to you with a resolution shortly.\n\nBest regards,\nCareLoop Team`;

        case 'friendly':
          return `${greeting}!\n\nThanks for reaching out about "${request.subject}". We got your message and we're looking into it right now.\n\nWe'll get back to you soon!\n\nCheers,\nCareLoop Team`;

        case 'apologetic':
          return `${greeting}\n\nI apologize for any inconvenience caused by "${request.subject}". We are reviewing your request and will provide a solution as quickly as possible.\n\nThank you for your understanding.\n\nSincerely,\nCareLoop Team`;

        case 'concise':
          return `${greeting}\n\nRe: "${request.subject}" - Received and under review. Will update shortly.\n\nBest,\nCareLoop Team`;

        default:
          return `${greeting}\n\nThank you for your request regarding "${request.subject}". We are reviewing it and will respond soon.\n\nBest regards,\nCareLoop Team`;
      }
    }

    if (order) {
      const orderNumber = order.externalOrderNumber;
      const orderStatus = order.orderStatus;
      const orderTotal = `${order.currency} ${order.total.toFixed(2)}`;

      switch (tone) {
        case 'professional':
          return `${greeting}\n\nI am writing to provide an update regarding your order #${orderNumber}.\n\nYour order is currently ${orderStatus} with a total of ${orderTotal}.\n\nWe are processing your order and will notify you when there are any updates.\n\nBest regards,\nCareLoop Team`;

        case 'friendly':
          return `${greeting}!\n\nJust wanted to update you on your order #${orderNumber}. It's currently ${orderStatus}.\n\nWe're working on it and will let you know as soon as it ships!\n\nCheers,\nCareLoop Team`;

        case 'apologetic':
          return `${greeting}\n\nI apologize for any delay with your order #${orderNumber}. We understand you're waiting and we're working to resolve this as quickly as possible.\n\nYour order (${orderTotal}) is currently ${orderStatus}. We will provide an update soon.\n\nThank you for your patience.\n\nSincerely,\nCareLoop Team`;

        case 'concise':
          return `${greeting}\n\nOrder #${orderNumber}: ${orderStatus}, total ${orderTotal}. Will update when status changes.\n\nBest,\nCareLoop Team`;

        default:
          return `${greeting}\n\nRegarding your order #${orderNumber}: it is currently ${orderStatus} with a total of ${orderTotal}.\n\nBest regards,\nCareLoop Team`;
      }
    }

    // Generic draft if no specific context
    return `${greeting}\n\nThank you for being a valued customer. We are here to assist you with any questions or concerns you may have.\n\nPlease let us know how we can help you today.\n\nBest regards,\nCareLoop Team`;
  }
}
