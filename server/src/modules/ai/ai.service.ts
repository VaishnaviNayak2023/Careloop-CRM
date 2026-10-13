import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ReplyDraftRequest {
  customerId: string;
  promiseId?: string;
  supportRequestId?: string;
  tone: 'professional' | 'friendly' | 'apologetic' | 'concise';
}

export interface ReplyDraftResponse {
  draft: string;
  context: {
    customerName: string;
    relevantPromise?: string;
    relevantRequest?: string;
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

    // Template-based fallback (clearly labeled as not AI-generated)
    const draft = this.generateTemplateDraft(customer, relevantPromise, relevantRequest, request.tone);

    return {
      draft,
      context: {
        customerName: customer.name,
        relevantPromise: relevantPromise?.title,
        relevantRequest: relevantRequest?.subject,
        tone: request.tone
      },
      isAIGenerated: false
    };
  }

  private generateTemplateDraft(
    customer: any,
    promise: any,
    request: any,
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

    // Generic draft if no specific context
    return `${greeting}\n\nThank you for being a valued customer. We are here to assist you with any questions or concerns you may have.\n\nPlease let us know how we can help you today.\n\nBest regards,\nCareLoop Team`;
  }
}
