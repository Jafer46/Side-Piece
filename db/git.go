package db

import (
	"side_piece/models"

	"github.com/jmoiron/sqlx"
)

func GetAllRepos(db *sqlx.DB) ([]models.DiscoveredRepos, error) {
	var repos []models.DiscoveredRepos
	err := db.Select(&repos, `SELECT * FROM discovered_repos ORDER BY created_at DESC`)
	return repos, err
}

func AddRepo(db *sqlx.DB, p models.DiscoveredRepos) (int64, error){
	res, err := db.Exec(`INSERT INTO discovered_repos 
		(name, path, branch, last_commit, created_at) 
		VALUES (?, ?, ?, ?, ?)`, 
		p.Name, p.Path, p.Branch, p.LastCommit, p.CreatedAt)

	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

func DeleteRepo(db *sqlx.DB, repoID int64) error {
	_, err := db.Exec(`DELETE FROM discovered_repos WHERE id = ?`, repoID)
	return err
}