-- Add image_urls column to store multiple image URLs as JSON
ALTER TABLE public.campaigns 
ADD COLUMN image_urls JSONB DEFAULT '[]'::jsonb;