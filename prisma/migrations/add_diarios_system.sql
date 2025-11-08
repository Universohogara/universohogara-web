
-- Sistema completo de diarios premium

-- Diarios de lectura
CREATE TABLE IF NOT EXISTS reading_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  book_title TEXT NOT NULL,
  author TEXT NOT NULL,
  pages INTEGER NOT NULL DEFAULT 0,
  total_pages INTEGER,
  rating INTEGER,
  genre TEXT,
  status TEXT NOT NULL DEFAULT 'reading',
  review TEXT,
  quotes TEXT,
  cover_image TEXT,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Diarios de películas/series
CREATE TABLE IF NOT EXISTS movie_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'movie',
  genre TEXT,
  rating INTEGER,
  director TEXT,
  year INTEGER,
  season INTEGER,
  episode INTEGER,
  review TEXT,
  quotes TEXT,
  poster_image TEXT,
  watched_with TEXT,
  watched_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Diarios de ejercicio
CREATE TABLE IF NOT EXISTS exercise_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  exercise_type TEXT NOT NULL,
  duration INTEGER NOT NULL,
  intensity TEXT NOT NULL DEFAULT 'moderate',
  calories INTEGER,
  weight REAL,
  body_measurements TEXT,
  personal_records TEXT,
  mood TEXT,
  notes TEXT,
  exercise_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Diarios de finanzas
CREATE TABLE IF NOT EXISTS finance_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  entry_type TEXT NOT NULL,
  amount REAL NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  payment_method TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  tags TEXT,
  entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Diarios de bienestar
CREATE TABLE IF NOT EXISTS wellness_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  mood INTEGER NOT NULL,
  energy INTEGER NOT NULL,
  sleep_hours REAL NOT NULL,
  sleep_quality INTEGER NOT NULL,
  water INTEGER DEFAULT 0,
  meditation INTEGER DEFAULT 0,
  gratitude TEXT,
  achievements TEXT,
  challenges TEXT,
  notes TEXT,
  entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Diarios de sueños (expandido)
CREATE TABLE IF NOT EXISTS dream_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'normal',
  emotions TEXT,
  symbols TEXT,
  people TEXT,
  places TEXT,
  colors TEXT,
  intensity INTEGER NOT NULL,
  clarity INTEGER NOT NULL,
  interpretation TEXT,
  tags TEXT,
  dream_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Diarios de gratitud (expandido)
CREATE TABLE IF NOT EXISTS gratitude_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  items TEXT NOT NULL,
  highlight TEXT,
  learnings TEXT,
  tomorrow TEXT,
  mood INTEGER NOT NULL,
  photos TEXT,
  entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Diarios de manifestación
CREATE TABLE IF NOT EXISTS manifestation_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  goal TEXT NOT NULL,
  affirmations TEXT NOT NULL,
  visualizations TEXT,
  actions TEXT,
  feelings TEXT,
  gratitude_for_it TEXT,
  progress INTEGER DEFAULT 0,
  is_achieved BOOLEAN DEFAULT FALSE,
  achieved_date TIMESTAMP,
  entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Trackers personalizables
CREATE TABLE IF NOT EXISTS tracker_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  tracker_name TEXT NOT NULL,
  tracker_icon TEXT,
  tracker_type TEXT NOT NULL DEFAULT 'monthly',
  legend TEXT NOT NULL,
  cells TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_reading_entries_user_id ON reading_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_movie_entries_user_id ON movie_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_entries_user_id ON exercise_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_finance_entries_user_id ON finance_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_wellness_entries_user_id ON wellness_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_dream_entries_user_id ON dream_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_gratitude_entries_user_id ON gratitude_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_manifestation_entries_user_id ON manifestation_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_tracker_entries_user_id ON tracker_entries(user_id);
