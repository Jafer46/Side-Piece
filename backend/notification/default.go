// notifications/defaults.go
package notifications

import (
	"embed"
	"os"
	"path/filepath"
)

// Embed the default persona images into the binary
//go:embed assets/personas/*
var defaultImages embed.FS

// ExtractDefaultImages copies embedded images to AppData on first run
func ExtractDefaultImages() error {
    destDir := GetDefaultImageDir()

    entries, err := defaultImages.ReadDir("assets/personas")
    if err != nil {
        return err
    }

    for _, entry := range entries {
        if entry.IsDir() {
            continue
        }

        destPath := filepath.Join(destDir, entry.Name())

        // Skip if already extracted
        if _, err := os.Stat(destPath); err == nil {
            continue
        }

        data, err := defaultImages.ReadFile("assets/personas/" + entry.Name())
        if err != nil {
            continue
        }

        if err := os.WriteFile(destPath, data, 0644); err != nil {
            return err
        }
    }

    return nil
}