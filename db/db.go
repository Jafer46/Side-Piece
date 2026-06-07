// db/db.go
package db

import (
	"github.com/jmoiron/sqlx"
	_ "modernc.org/sqlite"
)

func Open(path string) (*sqlx.DB, error) {
    db, err := sqlx.Open("sqlite", path)
    if err != nil {
        return nil, err
    }
    // SQLite plays badly with concurrent writes — one writer at a time
    db.SetMaxOpenConns(1)
    if err := migrate(db); err != nil {
        return nil, err
    }
    return db, nil
}

func migrate(db *sqlx.DB) error {
    schema := `
	CREATE TABLE IF NOT EXISTS personas (
		id          INTEGER PRIMARY KEY AUTOINCREMENT,
		name        TEXT NOT NULL,
		gender      TEXT NOT NULL,
        color       TEXT NOT NULL,
        emoji       TEXT NOT NULL,
        description TEXT,
		created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP

	);

    CREATE TABLE IF NOT EXISTS projects (
        id                  INTEGER PRIMARY KEY AUTOINCREMENT,
        name                TEXT NOT NULL,
        path                TEXT NOT NULL UNIQUE,
        status              TEXT NOT NULL DEFAULT 'active',
        last_commit_at      DATETIME,
        last_nag_at         DATETIME,
        nag_interval_hours  INTEGER NOT NULL DEFAULT 24,
        created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		persona_id          INTEGER NOT NULL REFERENCES personas(id)
    );

	CREATE TABLE IF NOT EXISTS persona_messages (
		id          INTEGER PRIMARY KEY AUTOINCREMENT,
		persona_id  INTEGER NOT NULL REFERENCES personas(id),
		message     TEXT NOT NULL,
		message_type TEXT NOT NULL,
		created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
	);

    CREATE TABLE IF NOT EXISTS notification_log (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id  INTEGER NOT NULL REFERENCES projects(id),
        message     TEXT NOT NULL,
        character   TEXT NOT NULL,
        snoozed_to  DATETIME,
        sent_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cron_log (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        job_name    TEXT NOT NULL,
        status      TEXT NOT NULL,
        ran_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    `
    _, err := db.Exec(schema)
    return err
}

