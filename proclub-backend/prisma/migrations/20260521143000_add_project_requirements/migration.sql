CREATE TABLE "ProjectRequirement" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 1,
    "courseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProjectRequirement_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ProjectRequirement_courseId_idx" ON "ProjectRequirement"("courseId");
CREATE INDEX "ProjectRequirement_isDeleted_idx" ON "ProjectRequirement"("isDeleted");

ALTER TABLE "ProjectRequirement" ADD CONSTRAINT "ProjectRequirement_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
