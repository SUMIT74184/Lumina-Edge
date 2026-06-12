-- Canvas pages (Notion-style diary/notes workspace)
CREATE TABLE canvas_pages (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     VARCHAR(255) NOT NULL,
    title       VARCHAR(500) NOT NULL DEFAULT 'Untitled',
    icon        VARCHAR(10) DEFAULT '📝',
    content     JSONB NOT NULL DEFAULT '{}',
    is_pinned   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_canvas_pages_user ON canvas_pages (user_id, updated_at DESC);
CREATE INDEX idx_canvas_pages_pinned ON canvas_pages (user_id, is_pinned DESC, updated_at DESC);
