CREATE TABLE admin_menus (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  parent_id INTEGER,
  label TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'item',
  target TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  admin_only INTEGER NOT NULL DEFAULT 0,
  enabled INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (parent_id) REFERENCES admin_menus (id)
);

CREATE INDEX idx_admin_menus_parent ON admin_menus (parent_id, sort_order);
CREATE UNIQUE INDEX idx_admin_menus_target ON admin_menus (target) WHERE target != '';

INSERT INTO admin_menus (parent_id, label, kind, target, sort_order, admin_only, enabled, created_at, updated_at)
VALUES
  (NULL, '內容管理', 'group', '', 10, 0, 1, 1732000000000, 1732000000000),
  (NULL, '系統設定', 'group', '', 20, 1, 1, 1732000000000, 1732000000000);

INSERT INTO admin_menus (parent_id, label, kind, target, sort_order, admin_only, enabled, created_at, updated_at)
SELECT id, '客戶詢問', 'item', 'enquiries', 10, 0, 1, 1732000000000, 1732000000000
FROM admin_menus WHERE kind = 'group' AND label = '內容管理' LIMIT 1;

INSERT INTO admin_menus (parent_id, label, kind, target, sort_order, admin_only, enabled, created_at, updated_at)
SELECT id, '網站內容', 'item', 'content', 20, 0, 1, 1732000000000, 1732000000000
FROM admin_menus WHERE kind = 'group' AND label = '內容管理' LIMIT 1;

INSERT INTO admin_menus (parent_id, label, kind, target, sort_order, admin_only, enabled, created_at, updated_at)
SELECT id, '媒體', 'item', 'media', 30, 0, 1, 1732000000000, 1732000000000
FROM admin_menus WHERE kind = 'group' AND label = '內容管理' LIMIT 1;

INSERT INTO admin_menus (parent_id, label, kind, target, sort_order, admin_only, enabled, created_at, updated_at)
SELECT id, '動態頁面', 'item', 'pages', 40, 0, 1, 1732000000000, 1732000000000
FROM admin_menus WHERE kind = 'group' AND label = '內容管理' LIMIT 1;

INSERT INTO admin_menus (parent_id, label, kind, target, sort_order, admin_only, enabled, created_at, updated_at)
SELECT id, '使用者', 'item', 'users', 10, 1, 1, 1732000000000, 1732000000000
FROM admin_menus WHERE kind = 'group' AND label = '系統設定' LIMIT 1;

INSERT INTO admin_menus (parent_id, label, kind, target, sort_order, admin_only, enabled, created_at, updated_at)
SELECT id, '選單管理', 'item', 'menus', 20, 1, 1, 1732000000000, 1732000000000
FROM admin_menus WHERE kind = 'group' AND label = '系統設定' LIMIT 1;
