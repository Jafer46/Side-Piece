package db

import (
	"side_piece/models"

	"gorm.io/gorm"
)

func GetAllRepos(db *gorm.DB) ([]models.DiscoveredRepos, error) {
	var repos []models.DiscoveredRepos
	res := db.Find(&repos)
	return repos, res.Error
}

func AddRepo(db *gorm.DB, p models.DiscoveredRepos) (models.DiscoveredRepos, error){
	res := db.Create(&p)
	return p, res.Error
}


func DeleteRepo(db *gorm.DB, repoID uint) error {
	var repo models.DiscoveredRepos
	result := db.Where("ID= ?", repoID).Delete(&repo)
	return result.Error
}