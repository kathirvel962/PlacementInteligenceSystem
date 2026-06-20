-- CreateTable
CREATE TABLE "DriveAssignment" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "placementDriveId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DriveAssignment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DriveAssignment" ADD CONSTRAINT "DriveAssignment_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "StudentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriveAssignment" ADD CONSTRAINT "DriveAssignment_placementDriveId_fkey" FOREIGN KEY ("placementDriveId") REFERENCES "PlacementDrive"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
