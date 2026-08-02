/*
  Warnings:

  - The values [TOOL_COMPANIES,PROFITABLE] on the enum `CompanyType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CompanyType_new" AS ENUM ('AI_NATIVE', 'MODEL_COMPANIES', 'UNICORNS', 'AI_MODEL_PROVIDERS', 'INFRASTRUCTURE', 'ENTERPRISE', 'HEALTHCARE', 'GENERATIVE_AI', 'MARKETING', 'DEVELOPER_TOOLS', 'ROBOTICS', 'EDUCATION', 'OPEN_SOURCE', 'FINANCE');
ALTER TABLE "public"."Company" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Company" ALTER COLUMN "type" TYPE "CompanyType_new"[] USING ("type"::text::"CompanyType_new"[]);
ALTER TYPE "CompanyType" RENAME TO "CompanyType_old";
ALTER TYPE "CompanyType_new" RENAME TO "CompanyType";
DROP TYPE "public"."CompanyType_old";
ALTER TABLE "Company" ALTER COLUMN "type" SET DEFAULT ARRAY[]::"CompanyType"[];
COMMIT;
