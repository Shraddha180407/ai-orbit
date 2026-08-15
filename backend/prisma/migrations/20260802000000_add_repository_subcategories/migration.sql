-- CreateTable
CREATE TABLE "RepositorySubCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "RepositorySubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepositorySubCategoryItem" (
    "id" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "subCategoryId" TEXT NOT NULL,

    CONSTRAINT "RepositorySubCategoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RepositorySubCategory_slug_key" ON "RepositorySubCategory"("slug");

-- CreateIndex
CREATE INDEX "RepositorySubCategory_slug_idx" ON "RepositorySubCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "RepositorySubCategoryItem_repositoryId_subCategoryId_key" ON "RepositorySubCategoryItem"("repositoryId", "subCategoryId");

-- CreateIndex
CREATE INDEX "RepositorySubCategoryItem_subCategoryId_idx" ON "RepositorySubCategoryItem"("subCategoryId");

-- AddForeignKey
ALTER TABLE "RepositorySubCategoryItem" ADD CONSTRAINT "RepositorySubCategoryItem_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepositorySubCategoryItem" ADD CONSTRAINT "RepositorySubCategoryItem_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "RepositorySubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
