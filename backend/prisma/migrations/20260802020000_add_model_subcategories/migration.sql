-- CreateTable
CREATE TABLE "ModelSubCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ModelSubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelSubCategoryItem" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "subCategoryId" TEXT NOT NULL,

    CONSTRAINT "ModelSubCategoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModelSubCategory_slug_key" ON "ModelSubCategory"("slug");

-- CreateIndex
CREATE INDEX "ModelSubCategory_slug_idx" ON "ModelSubCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ModelSubCategoryItem_modelId_subCategoryId_key" ON "ModelSubCategoryItem"("modelId", "subCategoryId");

-- CreateIndex
CREATE INDEX "ModelSubCategoryItem_subCategoryId_idx" ON "ModelSubCategoryItem"("subCategoryId");

-- AddForeignKey
ALTER TABLE "ModelSubCategoryItem" ADD CONSTRAINT "ModelSubCategoryItem_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "AIModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelSubCategoryItem" ADD CONSTRAINT "ModelSubCategoryItem_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "ModelSubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
