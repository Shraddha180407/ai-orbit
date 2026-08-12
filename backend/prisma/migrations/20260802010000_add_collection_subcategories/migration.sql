-- CreateTable
CREATE TABLE "CollectionSubCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "CollectionSubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionSubCategoryItem" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "subCategoryId" TEXT NOT NULL,

    CONSTRAINT "CollectionSubCategoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CollectionSubCategory_slug_key" ON "CollectionSubCategory"("slug");

-- CreateIndex
CREATE INDEX "CollectionSubCategory_slug_idx" ON "CollectionSubCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionSubCategoryItem_collectionId_subCategoryId_key" ON "CollectionSubCategoryItem"("collectionId", "subCategoryId");

-- CreateIndex
CREATE INDEX "CollectionSubCategoryItem_subCategoryId_idx" ON "CollectionSubCategoryItem"("subCategoryId");

-- AddForeignKey
ALTER TABLE "CollectionSubCategoryItem" ADD CONSTRAINT "CollectionSubCategoryItem_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionSubCategoryItem" ADD CONSTRAINT "CollectionSubCategoryItem_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "CollectionSubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
