package db

import (
	"side_piece/backend/db/models"

	"gorm.io/gorm"
)


func GetAllPersona(db *gorm.DB) ([]models.Persona, error) {
    var personas []models.Persona
    result := db.Find(&personas)
    return personas, result.Error
}

func AddPersona(db *gorm.DB, p models.Persona) (models.Persona, error) {
    res := db.Create(&p)
    return p, res.Error
}

func DeletePersona(db *gorm.DB, personaID uint) error {
    var persona models.Persona
    result := db.Where("ID= ?", personaID).Delete(&persona)
    return result.Error
}