-- CreateTable
CREATE TABLE "public"."TipoDeficiencia" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TipoDeficiencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubtipoDeficiencia" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubtipoDeficiencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Barreira" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Barreira_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Acessibilidade" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Acessibilidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubtipoBarreira" (
    "subtipoId" INTEGER NOT NULL,
    "barreiraId" INTEGER NOT NULL,

    CONSTRAINT "SubtipoBarreira_pkey" PRIMARY KEY ("subtipoId","barreiraId")
);

-- CreateTable
CREATE TABLE "public"."BarreiraAcessibilidade" (
    "barreiraId" INTEGER NOT NULL,
    "acessibilidadeId" INTEGER NOT NULL,

    CONSTRAINT "BarreiraAcessibilidade_pkey" PRIMARY KEY ("barreiraId","acessibilidadeId")
);

-- CreateTable
CREATE TABLE "public"."Empresa" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT,
    "email" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Vaga" (
    "id" SERIAL NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "escolaridade" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vaga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VagaSubtipo" (
    "vagaId" INTEGER NOT NULL,
    "subtipoId" INTEGER NOT NULL,

    CONSTRAINT "VagaSubtipo_pkey" PRIMARY KEY ("vagaId","subtipoId")
);

-- CreateTable
CREATE TABLE "public"."VagaAcessibilidade" (
    "vagaId" INTEGER NOT NULL,
    "acessibilidadeId" INTEGER NOT NULL,

    CONSTRAINT "VagaAcessibilidade_pkey" PRIMARY KEY ("vagaId","acessibilidadeId")
);

-- CreateTable
CREATE TABLE "public"."Candidato" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "escolaridade" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CandidatoSubtipo" (
    "candidatoId" INTEGER NOT NULL,
    "subtipoId" INTEGER NOT NULL,

    CONSTRAINT "CandidatoSubtipo_pkey" PRIMARY KEY ("candidatoId","subtipoId")
);

-- CreateTable
CREATE TABLE "public"."CandidatoSubtipoBarreira" (
    "candidatoId" INTEGER NOT NULL,
    "subtipoId" INTEGER NOT NULL,
    "barreiraId" INTEGER NOT NULL,

    CONSTRAINT "CandidatoSubtipoBarreira_pkey" PRIMARY KEY ("candidatoId","subtipoId","barreiraId")
);

-- CreateIndex
CREATE UNIQUE INDEX "TipoDeficiencia_nome_key" ON "public"."TipoDeficiencia"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "SubtipoDeficiencia_tipoId_nome_key" ON "public"."SubtipoDeficiencia"("tipoId", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "Barreira_descricao_key" ON "public"."Barreira"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "Acessibilidade_descricao_key" ON "public"."Acessibilidade"("descricao");

-- CreateIndex
CREATE INDEX "SubtipoBarreira_barreiraId_idx" ON "public"."SubtipoBarreira"("barreiraId");

-- CreateIndex
CREATE INDEX "BarreiraAcessibilidade_acessibilidadeId_idx" ON "public"."BarreiraAcessibilidade"("acessibilidadeId");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cnpj_key" ON "public"."Empresa"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_email_key" ON "public"."Empresa"("email");

-- CreateIndex
CREATE INDEX "VagaSubtipo_subtipoId_idx" ON "public"."VagaSubtipo"("subtipoId");

-- CreateIndex
CREATE INDEX "VagaAcessibilidade_acessibilidadeId_idx" ON "public"."VagaAcessibilidade"("acessibilidadeId");

-- CreateIndex
CREATE UNIQUE INDEX "Candidato_email_key" ON "public"."Candidato"("email");

-- CreateIndex
CREATE INDEX "Candidato_nome_idx" ON "public"."Candidato"("nome");

-- CreateIndex
CREATE INDEX "CandidatoSubtipo_subtipoId_idx" ON "public"."CandidatoSubtipo"("subtipoId");

-- CreateIndex
CREATE INDEX "CandidatoSubtipoBarreira_barreiraId_idx" ON "public"."CandidatoSubtipoBarreira"("barreiraId");

-- AddForeignKey
ALTER TABLE "public"."SubtipoDeficiencia" ADD CONSTRAINT "SubtipoDeficiencia_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "public"."TipoDeficiencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubtipoBarreira" ADD CONSTRAINT "SubtipoBarreira_subtipoId_fkey" FOREIGN KEY ("subtipoId") REFERENCES "public"."SubtipoDeficiencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubtipoBarreira" ADD CONSTRAINT "SubtipoBarreira_barreiraId_fkey" FOREIGN KEY ("barreiraId") REFERENCES "public"."Barreira"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BarreiraAcessibilidade" ADD CONSTRAINT "BarreiraAcessibilidade_barreiraId_fkey" FOREIGN KEY ("barreiraId") REFERENCES "public"."Barreira"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BarreiraAcessibilidade" ADD CONSTRAINT "BarreiraAcessibilidade_acessibilidadeId_fkey" FOREIGN KEY ("acessibilidadeId") REFERENCES "public"."Acessibilidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vaga" ADD CONSTRAINT "Vaga_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VagaSubtipo" ADD CONSTRAINT "VagaSubtipo_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "public"."Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VagaSubtipo" ADD CONSTRAINT "VagaSubtipo_subtipoId_fkey" FOREIGN KEY ("subtipoId") REFERENCES "public"."SubtipoDeficiencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VagaAcessibilidade" ADD CONSTRAINT "VagaAcessibilidade_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "public"."Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VagaAcessibilidade" ADD CONSTRAINT "VagaAcessibilidade_acessibilidadeId_fkey" FOREIGN KEY ("acessibilidadeId") REFERENCES "public"."Acessibilidade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidatoSubtipo" ADD CONSTRAINT "CandidatoSubtipo_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "public"."Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidatoSubtipo" ADD CONSTRAINT "CandidatoSubtipo_subtipoId_fkey" FOREIGN KEY ("subtipoId") REFERENCES "public"."SubtipoDeficiencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidatoSubtipoBarreira" ADD CONSTRAINT "CandidatoSubtipoBarreira_candidatoId_subtipoId_fkey" FOREIGN KEY ("candidatoId", "subtipoId") REFERENCES "public"."CandidatoSubtipo"("candidatoId", "subtipoId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidatoSubtipoBarreira" ADD CONSTRAINT "CandidatoSubtipoBarreira_barreiraId_fkey" FOREIGN KEY ("barreiraId") REFERENCES "public"."Barreira"("id") ON DELETE CASCADE ON UPDATE CASCADE;
