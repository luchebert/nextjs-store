/*
  Warnings:

  - Added the required column `name` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "priceInCents" INTEGER NOT NULL,
    "filePath" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("createdAt", "description", "filePath", "id", "imagePath", "isAvailable", "priceInCents", "updatedAt") SELECT "createdAt", "description", "filePath", "id", "imagePath", "isAvailable", "priceInCents", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
