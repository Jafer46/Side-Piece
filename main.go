package main

import (
	"embed"
	"fmt"
	"side_piece/backend/db/models"
	notifications "side_piece/backend/notification"

	"os"
	"path/filepath"

	"github.com/glebarez/sqlite"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"gorm.io/gorm"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {

	dbPath := filepath.Join(filepath.Dir(os.Args[0]), "sidepiece.db")

    database, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	database.AutoMigrate(
		&models.Project{}, &models.Persona{}, 
		&models.DiscoveredRepos{}, &models.ProjectCommit{}, 
		&models.CronLog{}, &models.PersonaMessages{})
	
	// Seed default personas + messages on first run
    if err := notifications.SeedDefaultPersonas(database); err != nil {
        panic(fmt.Errorf("failed to seed personas: %w", err))
    }
    

	
	// Create an instance of the app structure
	app := NewApp(database)

	// Create application with options
	err = wails.Run(&options.App{
		Title:  "side_piece",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
