-- CreateTable
CREATE TABLE "CatalogItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CatalogItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatalogItemTag" (
    "catalogItemId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "CatalogItemTag_pkey" PRIMARY KEY ("catalogItemId","tagId")
);

-- CreateTable
CREATE TABLE "DiscoverSwipe" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "catalogItemId" TEXT NOT NULL,
    "liked" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiscoverSwipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTagWeight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserTagWeight_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "WardrobeItem" ADD COLUMN "catalogItemId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Tag_key_key" ON "Tag"("key");

-- CreateIndex
CREATE INDEX "CatalogItem_isActive_createdAt_idx" ON "CatalogItem"("isActive", "createdAt");

-- CreateIndex
CREATE INDEX "CatalogItemTag_tagId_idx" ON "CatalogItemTag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscoverSwipe_userId_catalogItemId_key" ON "DiscoverSwipe"("userId", "catalogItemId");

-- CreateIndex
CREATE INDEX "DiscoverSwipe_userId_createdAt_idx" ON "DiscoverSwipe"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserTagWeight_userId_tagId_key" ON "UserTagWeight"("userId", "tagId");

-- CreateIndex
CREATE INDEX "UserTagWeight_userId_idx" ON "UserTagWeight"("userId");

-- CreateIndex
CREATE INDEX "WardrobeItem_userId_catalogItemId_idx" ON "WardrobeItem"("userId", "catalogItemId");

-- AddForeignKey
ALTER TABLE "CatalogItemTag" ADD CONSTRAINT "CatalogItemTag_catalogItemId_fkey" FOREIGN KEY ("catalogItemId") REFERENCES "CatalogItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatalogItemTag" ADD CONSTRAINT "CatalogItemTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscoverSwipe" ADD CONSTRAINT "DiscoverSwipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscoverSwipe" ADD CONSTRAINT "DiscoverSwipe_catalogItemId_fkey" FOREIGN KEY ("catalogItemId") REFERENCES "CatalogItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTagWeight" ADD CONSTRAINT "UserTagWeight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTagWeight" ADD CONSTRAINT "UserTagWeight_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WardrobeItem" ADD CONSTRAINT "WardrobeItem_catalogItemId_fkey" FOREIGN KEY ("catalogItemId") REFERENCES "CatalogItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
