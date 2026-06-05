package main

import (
	"embed"

	"os"
	"path/filepath"
	"side_piece/db"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {

	print("Hello 1")

	dbPath := filepath.Join(filepath.Dir(os.Args[0]), "sidepiece.db")

    database, err := db.Open(dbPath)
    

	
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
