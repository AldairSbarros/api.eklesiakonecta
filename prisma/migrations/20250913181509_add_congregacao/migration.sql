-- CreateTable
CREATE TABLE "Congregacao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "igrejaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Congregacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Congregacao_igrejaId_nome_key" ON "Congregacao"("igrejaId", "nome");

-- AddForeignKey
ALTER TABLE "Congregacao" ADD CONSTRAINT "Congregacao_igrejaId_fkey" FOREIGN KEY ("igrejaId") REFERENCES "Igreja"("id") ON DELETE CASCADE ON UPDATE CASCADE;
