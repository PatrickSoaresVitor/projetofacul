-- CreateTable
CREATE TABLE "public"."VagaCandidato" (
    "vagaId" INTEGER NOT NULL,
    "candidatoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VagaCandidato_pkey" PRIMARY KEY ("vagaId","candidatoId")
);

-- CreateIndex
CREATE INDEX "VagaCandidato_candidatoId_idx" ON "public"."VagaCandidato"("candidatoId");

-- AddForeignKey
ALTER TABLE "public"."VagaCandidato" ADD CONSTRAINT "VagaCandidato_vagaId_fkey" FOREIGN KEY ("vagaId") REFERENCES "public"."Vaga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VagaCandidato" ADD CONSTRAINT "VagaCandidato_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "public"."Candidato"("id") ON DELETE CASCADE ON UPDATE CASCADE;
