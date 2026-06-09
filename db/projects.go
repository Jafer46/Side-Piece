package db

import (
	"side_piece/models"
	"time"

	"gorm.io/gorm"
)

func AddProject(db *gorm.DB,p models.Project) (models.Project, error) {

    result := db.Create(&p)

    if result.Error != nil {
        return p, result.Error
    }

    return p, nil
}

func GetAllProjects(db *gorm.DB) ([]models.Project, error) {
    var projects []models.Project
    result := db.Find(&projects).Preload("Persona")
    return projects, result.Error
}

func GetActiveProjects(db *gorm.DB) ([]models.Project, error) {
    var projects []models.Project
    result := db.Find(&projects, "status = ?", "active")
    return projects, result.Error
}

func UpdateLastCommit(db *gorm.DB, projectID uint) error {
    now:= time.Now()
    result := db.Where("ID = ?", projectID).Save(&models.Project{
        LastCommitAt: &now,
    })
    return result.Error
}

func UpdateStatus(db *gorm.DB, projectID uint, status string) error {
    result :=  db.Where("ID = ?", projectID).Save(&models.Project{
        Status: status,
    })
    return result.Error
}

func DeleteProject(db *gorm.DB, projectID uint) error {
    var project models.Project
    result := db.Where("ID= ?", projectID).Delete(&project)
    return result.Error
}