CREATE TABLE "CertificateTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "backgroundPath" TEXT NOT NULL,
    "backgroundUrl" TEXT NOT NULL,
    "imageWidth" INTEGER NOT NULL,
    "imageHeight" INTEGER NOT NULL,
    "nameX" INTEGER NOT NULL DEFAULT 420,
    "nameY" INTEGER NOT NULL DEFAULT 320,
    "dateX" INTEGER NOT NULL DEFAULT 420,
    "dateY" INTEGER NOT NULL DEFAULT 470,
    "qrX" INTEGER NOT NULL DEFAULT 940,
    "qrY" INTEGER NOT NULL DEFAULT 470,
    "qrSize" INTEGER NOT NULL DEFAULT 120,
    "fontFamily" TEXT NOT NULL DEFAULT 'Helvetica',
    "nameFontSize" INTEGER NOT NULL DEFAULT 42,
    "dateFontSize" INTEGER NOT NULL DEFAULT 18,
    "textColor" TEXT NOT NULL DEFAULT '#1A2E20',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CertificateTemplate_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Certificate" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "learningPath" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pdfPath" TEXT NOT NULL,
    "pdfUrl" TEXT NOT NULL,
    "verificationUrl" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "templateId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Certificate_code_key" ON "Certificate"("code");
CREATE UNIQUE INDEX "Certificate_userId_courseId_key" ON "Certificate"("userId", "courseId");
CREATE INDEX "Certificate_code_idx" ON "Certificate"("code");
CREATE INDEX "Certificate_userId_idx" ON "Certificate"("userId");
CREATE INDEX "Certificate_courseId_idx" ON "Certificate"("courseId");

ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "CertificateTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
