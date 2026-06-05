package db

import (
	"side_piece/models"

	"github.com/jmoiron/sqlx"
)

func AddProject(db *sqlx.DB, p models.Project) (int64, error) {
    res, err := db.Exec(`
        INSERT INTO projects (name, path, persona_id, nag_interval_hours)
        VALUES (?, ?, ?, ?)`,
        p.Name, p.Path, p.PersonaID, p.NagIntervalHours,
    )
    if err != nil {
        return 0, err
    }
    return res.LastInsertId()
}

func GetAllProjects(db *sqlx.DB) ([]models.Project, error) {
    var projects []models.Project
    err := db.Select(&projects, `SELECT * FROM projects ORDER BY created_at DESC`)
    return projects, err
}

func GetActiveProjects(db *sqlx.DB) ([]models.Project, error) {
    var projects []models.Project
    err := db.Select(&projects,
        `SELECT * FROM projects WHERE status != 'paused' ORDER BY last_commit_at ASC`)
    return projects, err
}

func UpdateLastCommit(db *sqlx.DB, projectID int64) error {
    _, err := db.Exec(`
        UPDATE projects
        SET last_commit_at = CURRENT_TIMESTAMP, status = 'active'
        WHERE id = ?`, projectID)
    return err
}

func UpdateStatus(db *sqlx.DB, projectID int64, status string) error {
    _, err := db.Exec(`UPDATE projects SET status = ? WHERE id = ?`, status, projectID)
    return err
}

func DeleteProject(db *sqlx.DB, projectID int64) error {
    _, err := db.Exec(`DELETE FROM projects WHERE id = ?`, projectID)
    return err
}