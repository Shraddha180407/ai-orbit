-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "availability" TEXT NOT NULL,
    "price" TEXT,
    "year" TEXT NOT NULL,
    "month" TEXT,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "manufacturerLogoUrl" TEXT,
    "mainTask" TEXT,
    "formFactor" TEXT,
    "country" TEXT,
    "ram" TEXT,
    "aiFeatures" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "primaryUseCases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "additionalInfo" TEXT,
    "buyUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Device_slug_key" ON "Device"("slug");

-- CreateIndex
CREATE INDEX "Device_slug_idx" ON "Device"("slug");

-- CreateIndex
CREATE INDEX "Device_createdAt_idx" ON "Device"("createdAt");

-- CreateIndex
CREATE INDEX "Device_updatedAt_idx" ON "Device"("updatedAt");

-- AddForeignKey
ALTER TABLE "TaskDevice" ADD CONSTRAINT "TaskDevice_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;
