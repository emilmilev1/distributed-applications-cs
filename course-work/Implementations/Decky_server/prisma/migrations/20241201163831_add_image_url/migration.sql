/*
  Warnings:

  - You are about to drop the column `value` on the `cards` table. All the data in the column will be lost.
  - You are about to drop the column `cards` on the `decks` table. All the data in the column will be lost.
  - Added the required column `iconUrl` to the `cards` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `cards` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[cards] DROP COLUMN [value];
ALTER TABLE [dbo].[cards] ADD [iconUrl] VARCHAR(255) NOT NULL,
[name] VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[decks] DROP COLUMN [cards];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
