-- Add elevenLabsApiKey field to User table for BYOK (Bring Your Own Key) feature
ALTER TABLE "users" ADD COLUMN "elevenLabsApiKey" TEXT;
