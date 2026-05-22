CREATE TABLE "UpcomingEvent" (
  "id" SERIAL NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "location" TEXT,
  "eventDate" TIMESTAMP(3) NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "isDeleted" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "UpcomingEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "UpcomingEvent_eventDate_idx" ON "UpcomingEvent"("eventDate");
CREATE INDEX "UpcomingEvent_isActive_isDeleted_idx" ON "UpcomingEvent"("isActive", "isDeleted");
