/*
  Warnings:

  - You are about to drop the column `thumbnail` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the `Lesson` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `description` on table `Course` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Module` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_moduleId_fkey";

-- DropIndex
DROP INDEX "Module_courseId_idx";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "thumbnail",
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "Module" ALTER COLUMN "description" SET NOT NULL;

-- DropTable
DROP TABLE "Lesson";
