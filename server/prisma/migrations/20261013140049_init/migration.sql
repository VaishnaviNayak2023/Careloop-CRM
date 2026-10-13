-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CUSTOMER',
    "accountStatus" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "customerType" TEXT NOT NULL DEFAULT 'individual',
    "status" TEXT NOT NULL DEFAULT 'active',
    "source" TEXT NOT NULL DEFAULT 'direct',
    "tags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "customers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "staff_admins" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "department" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "staff_admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "assignments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "assignedBy" TEXT NOT NULL,
    "startAt" DATETIME NOT NULL,
    "endAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "handoverNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    CONSTRAINT "assignments_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "assignments_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "staff_admins" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "assignments_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "staff_admins" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "promises" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "orderId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dueAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "createdBy" TEXT NOT NULL,
    "assignedTo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "completedAt" DATETIME,
    "completedBy" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "promises_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "promises_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "promises_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "staff_admins" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "promises_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "staff_admins" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "promises_completedBy_fkey" FOREIGN KEY ("completedBy") REFERENCES "staff_admins" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "interactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'note',
    "summary" TEXT NOT NULL,
    "details" TEXT,
    "authorId" TEXT,
    "authorName" TEXT,
    "isInternal" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "interactions_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "support_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "assignedTo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "resolvedAt" DATETIME,
    "customerVisible" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "support_requests_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "support_requests_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "staff_admins" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "activity_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorId" TEXT NOT NULL,
    "customerId" TEXT,
    "staffId" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changes" TEXT,
    "correlationId" TEXT,
    CONSTRAINT "activity_events_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "activity_events_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "activity_events_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "staff_admins" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "integrations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT NOT NULL DEFAULT 'woocommerce',
    "storeUrl" TEXT NOT NULL,
    "storeName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DISCONNECTED',
    "credentialHash" TEXT,
    "lastSyncAt" DATETIME,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "external_customer_mappings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "integrationId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "externalCustomerId" TEXT,
    "externalEmail" TEXT NOT NULL,
    "lastSyncedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "external_customer_mappings_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "integrations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "external_customer_mappings_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "external_order_mappings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "integrationId" TEXT NOT NULL,
    "internalOrderId" TEXT NOT NULL,
    "externalOrderId" TEXT NOT NULL,
    "externalOrderNumber" TEXT NOT NULL,
    "lastSyncedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "externalModifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "external_order_mappings_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "integrations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "external_order_mappings_internalOrderId_fkey" FOREIGN KEY ("internalOrderId") REFERENCES "orders" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "integrationId" TEXT,
    "customerId" TEXT,
    "externalOrderId" TEXT,
    "externalOrderNumber" TEXT,
    "orderStatus" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "total" REAL NOT NULL,
    "paymentMethod" TEXT,
    "paymentStatus" TEXT,
    "shippingAddress" TEXT,
    "billingAddress" TEXT,
    "lineItems" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastSyncedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "orders_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "integrations" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sync_jobs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "integrationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "startedAt" DATETIME,
    "finishedAt" DATETIME,
    "processedCount" INTEGER NOT NULL DEFAULT 0,
    "createdCount" INTEGER NOT NULL DEFAULT 0,
    "updatedCount" INTEGER NOT NULL DEFAULT 0,
    "skippedCount" INTEGER NOT NULL DEFAULT 0,
    "failedCount" INTEGER NOT NULL DEFAULT 0,
    "errorSummary" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "sync_jobs_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "integrations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "webhook_receipts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "integrationId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "externalResourceId" TEXT,
    "eventKey" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RECEIVED',
    "receivedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" DATETIME,
    "errorSummary" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "webhook_receipts_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "integrations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customers_userId_key" ON "customers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "staff_admins_userId_key" ON "staff_admins"("userId");

-- CreateIndex
CREATE INDEX "assignments_customerId_idx" ON "assignments"("customerId");

-- CreateIndex
CREATE INDEX "assignments_adminId_idx" ON "assignments"("adminId");

-- CreateIndex
CREATE INDEX "promises_customerId_idx" ON "promises"("customerId");

-- CreateIndex
CREATE INDEX "promises_assignedTo_idx" ON "promises"("assignedTo");

-- CreateIndex
CREATE INDEX "promises_dueAt_idx" ON "promises"("dueAt");

-- CreateIndex
CREATE INDEX "promises_orderId_idx" ON "promises"("orderId");

-- CreateIndex
CREATE INDEX "interactions_customerId_idx" ON "interactions"("customerId");

-- CreateIndex
CREATE INDEX "interactions_createdAt_idx" ON "interactions"("createdAt");

-- CreateIndex
CREATE INDEX "support_requests_customerId_idx" ON "support_requests"("customerId");

-- CreateIndex
CREATE INDEX "support_requests_assignedTo_idx" ON "support_requests"("assignedTo");

-- CreateIndex
CREATE INDEX "support_requests_status_idx" ON "support_requests"("status");

-- CreateIndex
CREATE INDEX "activity_events_entityType_entityId_idx" ON "activity_events"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "activity_events_timestamp_idx" ON "activity_events"("timestamp");

-- CreateIndex
CREATE INDEX "integrations_status_idx" ON "integrations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "integrations_provider_storeUrl_key" ON "integrations"("provider", "storeUrl");

-- CreateIndex
CREATE INDEX "external_customer_mappings_integrationId_idx" ON "external_customer_mappings"("integrationId");

-- CreateIndex
CREATE INDEX "external_customer_mappings_customerId_idx" ON "external_customer_mappings"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "external_customer_mappings_integrationId_externalCustomerId_key" ON "external_customer_mappings"("integrationId", "externalCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "external_customer_mappings_integrationId_externalEmail_key" ON "external_customer_mappings"("integrationId", "externalEmail");

-- CreateIndex
CREATE UNIQUE INDEX "external_order_mappings_internalOrderId_key" ON "external_order_mappings"("internalOrderId");

-- CreateIndex
CREATE INDEX "external_order_mappings_integrationId_idx" ON "external_order_mappings"("integrationId");

-- CreateIndex
CREATE INDEX "external_order_mappings_internalOrderId_idx" ON "external_order_mappings"("internalOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "external_order_mappings_integrationId_externalOrderId_key" ON "external_order_mappings"("integrationId", "externalOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_externalOrderId_key" ON "orders"("externalOrderId");

-- CreateIndex
CREATE INDEX "orders_integrationId_idx" ON "orders"("integrationId");

-- CreateIndex
CREATE INDEX "orders_customerId_idx" ON "orders"("customerId");

-- CreateIndex
CREATE INDEX "orders_externalOrderId_idx" ON "orders"("externalOrderId");

-- CreateIndex
CREATE INDEX "sync_jobs_integrationId_idx" ON "sync_jobs"("integrationId");

-- CreateIndex
CREATE INDEX "sync_jobs_status_idx" ON "sync_jobs"("status");

-- CreateIndex
CREATE INDEX "webhook_receipts_integrationId_idx" ON "webhook_receipts"("integrationId");

-- CreateIndex
CREATE INDEX "webhook_receipts_status_idx" ON "webhook_receipts"("status");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_receipts_eventKey_key" ON "webhook_receipts"("eventKey");
