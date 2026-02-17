-- CreateTable
CREATE TABLE "Settlement" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "paidBy" INTEGER NOT NULL,
    "paidTo" INTEGER NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settlement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Settlement_groupId_idx" ON "Settlement"("groupId");

-- AddForeignKey
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_paidBy_fkey" FOREIGN KEY ("paidBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_paidTo_fkey" FOREIGN KEY ("paidTo") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
