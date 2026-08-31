CREATE TABLE "WriterSubmission" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "portfolioUrl" TEXT,
    "authorBio" TEXT NOT NULL,
    "articleTitle" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "googleDocsUrl" TEXT NOT NULL,
    "contributionFrequency" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WriterSubmission_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "WriterSubmission_status_createdAt_idx" ON "WriterSubmission"("status", "createdAt");
CREATE INDEX "WriterSubmission_email_idx" ON "WriterSubmission"("email");
