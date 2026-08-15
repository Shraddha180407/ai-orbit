-- CreateTable
CREATE TABLE "MCPSubCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "MCPSubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCPSubCategoryItem" (
    "id" TEXT NOT NULL,
    "mcpItemId" TEXT NOT NULL,
    "subCategoryId" TEXT NOT NULL,

    CONSTRAINT "MCPSubCategoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceSubCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "DeviceSubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceSubCategoryItem" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "subCategoryId" TEXT NOT NULL,

    CONSTRAINT "DeviceSubCategoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MCPSubCategory_slug_key" ON "MCPSubCategory"("slug");

-- CreateIndex
CREATE INDEX "MCPSubCategory_slug_idx" ON "MCPSubCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MCPSubCategoryItem_mcpItemId_subCategoryId_key" ON "MCPSubCategoryItem"("mcpItemId", "subCategoryId");

-- CreateIndex
CREATE INDEX "MCPSubCategoryItem_subCategoryId_idx" ON "MCPSubCategoryItem"("subCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceSubCategory_slug_key" ON "DeviceSubCategory"("slug");

-- CreateIndex
CREATE INDEX "DeviceSubCategory_slug_idx" ON "DeviceSubCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceSubCategoryItem_deviceId_subCategoryId_key" ON "DeviceSubCategoryItem"("deviceId", "subCategoryId");

-- CreateIndex
CREATE INDEX "DeviceSubCategoryItem_subCategoryId_idx" ON "DeviceSubCategoryItem"("subCategoryId");

-- AddForeignKey
ALTER TABLE "MCPSubCategoryItem" ADD CONSTRAINT "MCPSubCategoryItem_mcpItemId_fkey" FOREIGN KEY ("mcpItemId") REFERENCES "MCPItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPSubCategoryItem" ADD CONSTRAINT "MCPSubCategoryItem_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "MCPSubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceSubCategoryItem" ADD CONSTRAINT "DeviceSubCategoryItem_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceSubCategoryItem" ADD CONSTRAINT "DeviceSubCategoryItem_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "DeviceSubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
