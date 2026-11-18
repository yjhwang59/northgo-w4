CREATE TABLE enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  locale TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT '',
  services TEXT NOT NULL DEFAULT '[]',
  message TEXT NOT NULL DEFAULT '',
  terms_accepted INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  ip_hash TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL
);

CREATE INDEX idx_enquiries_created ON enquiries (created_at DESC);
CREATE INDEX idx_enquiries_ip ON enquiries (ip_hash, created_at);

CREATE TABLE admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  admin_id INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY (admin_id) REFERENCES admins (id)
);

CREATE TABLE content_overrides (
  locale TEXT NOT NULL,
  field_key TEXT NOT NULL,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (locale, field_key)
);
