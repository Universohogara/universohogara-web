
-- Add new columns to blog_posts
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS category VARCHAR(255),
ADD COLUMN IF NOT EXISTS author_name VARCHAR(255) DEFAULT 'Universo Hogara',
ADD COLUMN IF NOT EXISTS tags TEXT,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS blog_posts_category_idx ON blog_posts(category);
CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON blog_posts(published);

-- Update existing posts to have a default category if they don't have one
UPDATE blog_posts SET category = 'hogara-app' WHERE category IS NULL;
