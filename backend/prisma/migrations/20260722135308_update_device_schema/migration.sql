-- 1. Create the enum if it doesn't already exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'Availability'
    ) THEN
        CREATE TYPE "Availability" AS ENUM (
            'Available',
            'Pre-order',
            'Announced',
            'Discontinued'
        );
    END IF;
END $$;

-- 2. Convert Device.availability from TEXT to the enum
ALTER TABLE "Device"
ALTER COLUMN "availability" DROP DEFAULT,
ALTER COLUMN "availability" TYPE "Availability"
USING "availability"::"Availability",
ALTER COLUMN "availability" SET DEFAULT 'Announced';

-- 3. Make these columns NOT NULL
-- (This will fail if existing rows contain NULLs.)
ALTER TABLE "Device"
ALTER COLUMN "imageUrl" SET NOT NULL,
ALTER COLUMN "mainTask" SET NOT NULL,
ALTER COLUMN "manufacturerLogoUrl" SET NOT NULL;

-- 4. Remove Repository column defaults
ALTER TABLE "Repository"
ALTER COLUMN "topics" DROP DEFAULT,
ALTER COLUMN "forks" DROP DEFAULT,
ALTER COLUMN "openIssues" DROP DEFAULT;