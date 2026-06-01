ALTER TABLE "User" ADD COLUMN "learningCommitmentAccepted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "learningCommitmentAcceptedAt" TIMESTAMP(3);
