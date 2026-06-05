package db

import (
	"side_piece/models"

	"github.com/jmoiron/sqlx"
)
func GetAllPersona(db *sqlx.DB) ([]models.Persona, error) {
    var personas []models.Persona
    err := db.Select(&personas, `SELECT * FROM personas ORDER BY created_at DESC`)
    return personas, err
}

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

func DeletePersona(db *sqlx.DB, personaID int64) error {
    _, err := db.Exec(`DELETE FROM personas WHERE id = ?`, personaID)
    return err
}