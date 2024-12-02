BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] INT NOT NULL IDENTITY(1,1),
    [username] VARCHAR(50) NOT NULL,
    [email] VARCHAR(100) NOT NULL,
    [password] VARCHAR(255) NOT NULL,
    [role] VARCHAR(20) NOT NULL CONSTRAINT [users_role_df] DEFAULT 'USER',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [users_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [users_username_key] UNIQUE NONCLUSTERED ([username]),
    CONSTRAINT [users_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[decks] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(50) NOT NULL,
    [cards] TEXT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [decks_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [userId] INT NOT NULL,
    [description] VARCHAR(255) NOT NULL,
    [isPublic] BIT NOT NULL CONSTRAINT [decks_isPublic_df] DEFAULT 0,
    CONSTRAINT [decks_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[cards] (
    [id] INT NOT NULL IDENTITY(1,1),
    [value] VARCHAR(100) NOT NULL,
    [rarity] VARCHAR(20) NOT NULL,
    [cost] INT NOT NULL,
    [power] FLOAT(53) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [cards_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [deckId] INT NOT NULL,
    CONSTRAINT [cards_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[decks] ADD CONSTRAINT [decks_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[cards] ADD CONSTRAINT [cards_deckId_fkey] FOREIGN KEY ([deckId]) REFERENCES [dbo].[decks]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
