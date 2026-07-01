package db

import (
	"side_piece/backend/db/models"

	"gorm.io/gorm"
)


func GetAllPersonaMessages(db *gorm.DB) ([]models.PersonaMessages, error) {
    var personasMessages []models.PersonaMessages
    result := db.Find(&personasMessages)
    return personasMessages, result.Error
}

func GetMessagesByPersona(db *gorm.DB, personaID uint) ([]models.PersonaMessages, error){
	var personaMessages []models.PersonaMessages
	result := db.Find(&personaMessages).Where(models.PersonaMessages{
		PersonaID: personaID,
	})
	return personaMessages, result.Error
}

func AddPersonaMessages(db *gorm.DB, p models.PersonaMessages) (models.PersonaMessages, error) {
    res := db.Create(&p)
    return p, res.Error
}

func DeletePersonaMessages(db *gorm.DB, personaID uint) error {
    var PersonaMessages models.PersonaMessages
    result := db.Where("ID= ?", personaID).Delete(&PersonaMessages)
    return result.Error
}