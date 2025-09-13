-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM');

-- CreateEnum
CREATE TYPE "EtapaDiscipulado" AS ENUM ('MINICURSO', 'ANDANDO_COM_CRISTO', 'AGORA_QUE_SOU_DE_CRISTO', 'CONSOLIDACAO', 'ESCOLA_LIDERES_N1', 'ESCOLA_LIDERES_N2', 'ESCOLA_LIDERES_N3', 'ENCONTRO_COM_DEUS', 'BATISMO_AGUAS', 'LIBERADO_LIDERAR');

-- AlterTable
ALTER TABLE "Celula" ADD COLUMN     "anfitriaoMembroId" INTEGER,
ADD COLUMN     "diaSemana" "DiaSemana",
ADD COLUMN     "geracaoId" INTEGER,
ADD COLUMN     "horario" TEXT,
ADD COLUMN     "liderMembroId" INTEGER,
ADD COLUMN     "localReuniao" TEXT,
ADD COLUMN     "secretarioMembroId" INTEGER,
ADD COLUMN     "tesoureiroMembroId" INTEGER,
ADD COLUMN     "viceLiderMembroId" INTEGER;

-- AlterTable
ALTER TABLE "Membro" ADD COLUMN     "aptoLiderar" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ativoNaCongregacao" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Geracao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "congregacaoId" INTEGER NOT NULL,
    "liderGeracaoMembroId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Geracao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembroEtapa" (
    "id" SERIAL NOT NULL,
    "membroId" INTEGER NOT NULL,
    "etapa" "EtapaDiscipulado" NOT NULL,
    "dataConclusao" TIMESTAMP(3),
    "observacao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MembroEtapa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Geracao_congregacaoId_idx" ON "Geracao"("congregacaoId");

-- CreateIndex
CREATE UNIQUE INDEX "Geracao_congregacaoId_nome_key" ON "Geracao"("congregacaoId", "nome");

-- CreateIndex
CREATE INDEX "MembroEtapa_membroId_idx" ON "MembroEtapa"("membroId");

-- CreateIndex
CREATE INDEX "MembroEtapa_etapa_idx" ON "MembroEtapa"("etapa");

-- CreateIndex
CREATE UNIQUE INDEX "MembroEtapa_membroId_etapa_key" ON "MembroEtapa"("membroId", "etapa");

-- CreateIndex
CREATE INDEX "Celula_geracaoId_idx" ON "Celula"("geracaoId");

-- AddForeignKey
ALTER TABLE "Celula" ADD CONSTRAINT "Celula_geracaoId_fkey" FOREIGN KEY ("geracaoId") REFERENCES "Geracao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Celula" ADD CONSTRAINT "Celula_liderMembroId_fkey" FOREIGN KEY ("liderMembroId") REFERENCES "Membro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Celula" ADD CONSTRAINT "Celula_viceLiderMembroId_fkey" FOREIGN KEY ("viceLiderMembroId") REFERENCES "Membro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Celula" ADD CONSTRAINT "Celula_secretarioMembroId_fkey" FOREIGN KEY ("secretarioMembroId") REFERENCES "Membro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Celula" ADD CONSTRAINT "Celula_tesoureiroMembroId_fkey" FOREIGN KEY ("tesoureiroMembroId") REFERENCES "Membro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Celula" ADD CONSTRAINT "Celula_anfitriaoMembroId_fkey" FOREIGN KEY ("anfitriaoMembroId") REFERENCES "Membro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Geracao" ADD CONSTRAINT "Geracao_congregacaoId_fkey" FOREIGN KEY ("congregacaoId") REFERENCES "Congregacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Geracao" ADD CONSTRAINT "Geracao_liderGeracaoMembroId_fkey" FOREIGN KEY ("liderGeracaoMembroId") REFERENCES "Membro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembroEtapa" ADD CONSTRAINT "MembroEtapa_membroId_fkey" FOREIGN KEY ("membroId") REFERENCES "Membro"("id") ON DELETE CASCADE ON UPDATE CASCADE;
