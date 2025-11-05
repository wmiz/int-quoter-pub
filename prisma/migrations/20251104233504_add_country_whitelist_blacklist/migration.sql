-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopId" TEXT NOT NULL,
    "regionMode" TEXT NOT NULL DEFAULT 'allow',
    "regions" TEXT NOT NULL DEFAULT '[]',
    "whitelistCountries" TEXT NOT NULL DEFAULT '[]',
    "blacklistCountries" TEXT NOT NULL DEFAULT '[]',
    "popupFields" TEXT,
    "draftOrderTags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Settings_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Settings" ("createdAt", "draftOrderTags", "id", "popupFields", "regionMode", "regions", "shopId", "updatedAt") SELECT "createdAt", "draftOrderTags", "id", "popupFields", "regionMode", "regions", "shopId", "updatedAt" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
CREATE UNIQUE INDEX "Settings_shopId_key" ON "Settings"("shopId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
