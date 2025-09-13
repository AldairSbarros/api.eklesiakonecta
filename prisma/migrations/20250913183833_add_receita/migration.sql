-- CreateEnum
CREATE TYPE "ReceitaTipo" AS ENUM ('DIZIMO', 'OFERTA', 'VOTO', 'OFERTA_ALCADA');

-- CreateEnum
CREATE TYPE "FormaPagamento" AS ENUM ('ESPECIE', 'PIX');

-- CreateTable
CREATE TABLE "Receita" (
    "id" SERIAL NOT NULL,
    "congregacaoId" INTEGER NOT NULL,
    "membroId" INTEGER,
    "tipo" "ReceitaTipo" NOT NULL,
    "formaPagamento" "FormaPagamento" NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "numeroRecibo" INTEGER NOT NULL,
    "cultoDescricao" TEXT,
    "fotoPath" TEXT,
    "observacao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Receita_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Receita_congregacaoId_data_idx" ON "Receita"("congregacaoId", "data");

-- CreateIndex
CREATE INDEX "Receita_membroId_idx" ON "Receita"("membroId");

-- CreateIndex
CREATE INDEX "Receita_tipo_idx" ON "Receita"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "Receita_congregacaoId_numeroRecibo_key" ON "Receita"("congregacaoId", "numeroRecibo");

-- AddForeignKey
ALTER TABLE "Receita" ADD CONSTRAINT "Receita_congregacaoId_fkey" FOREIGN KEY ("congregacaoId") REFERENCES "Congregacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receita" ADD CONSTRAINT "Receita_membroId_fkey" FOREIGN KEY ("membroId") REFERENCES "Membro"("id") ON DELETE SET NULL ON UPDATE CASCADE;
