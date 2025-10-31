-- AlterTable
-- SQLite doesn't support DROP COLUMN directly, so we need to recreate the table
CREATE TABLE "Settings_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopId" TEXT NOT NULL,
    "regionMode" TEXT NOT NULL DEFAULT 'allow',
    "regions" TEXT NOT NULL DEFAULT '[]',
    "popupFields" TEXT,
    "draftOrderTags" TEXT,
    "themeExtensionEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Settings_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Copy data from old table to new table (excluding placements)
INSERT INTO "Settings_new" ("id", "shopId", "regionMode", "regions", "popupFields", "draftOrderTags", "themeExtensionEnabled", "createdAt", "updatedAt")
SELECT "id", "shopId", "regionMode", "regions", "popupFields", "draftOrderTags", "themeExtensionEnabled", "createdAt", "updatedAt"
FROM "Settings";

-- Drop old table
DROP TABLE "Settings";

-- Rename new table
ALTER TABLE "Settings_new" RENAME TO "Settings";

-- Recreate index
CREATE UNIQUE INDEX "Settings_shopId_key" ON "Settings"("shopId");

