package db

import (
	"side_piece/models"

	"github.com/jmoiron/sqlx"
)

func AddPersona(db *sqlx.DB, p models.Persona) (int64, error) {
    res, err := db.Exec(`
        INSERT INTO personas (name, gender)
        VALUES (?, ?)`,
        p.Name, p.Gender,
    )
    if err != nil {
        return 0, err
    }
    return res.LastInsertId()
}