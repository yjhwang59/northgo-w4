ALTER TABLE admins ADD COLUMN role TEXT NOT NULL DEFAULT 'editor';
UPDATE admins SET role = 'admin';

CREATE TABLE media_assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  uploaded_by INTEGER,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (uploaded_by) REFERENCES admins (id)
);

CREATE INDEX idx_media_created ON media_assets (created_at DESC);

CREATE TABLE cms_pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  locale TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  cover_key TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft',
  updated_at INTEGER NOT NULL,
  created_by INTEGER,
  FOREIGN KEY (created_by) REFERENCES admins (id),
  UNIQUE (locale, slug)
);

CREATE INDEX idx_cms_pages_locale_status ON cms_pages (locale, status);
