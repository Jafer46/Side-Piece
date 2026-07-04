// notifications/images.go
package notifications

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"runtime"
	"side_piece/backend/db/models"
	"strings"
)

// GetImageStorageDir returns where user-uploaded images are stored
func GetImageStorageDir() string {
    var base string
    switch runtime.GOOS {
    case "windows":
        base = os.Getenv("APPDATA")
    default: // linux
        home, _ := os.UserHomeDir()
        base = filepath.Join(home, ".config")
    }
    dir := filepath.Join(base, "Sidepiece", "images")
    os.MkdirAll(dir, 0755)
    return dir
}

// GetDefaultImageDir returns the path to shipped default images
// In Wails these are embedded — we extract them on first run
func GetDefaultImageDir() string {
    dir := filepath.Join(GetImageStorageDir(), "defaults")
    os.MkdirAll(dir, 0755)
    return dir
}

// SaveUserImage copies an uploaded image to AppData storage
// Returns the stored path
func SaveUserImage(sourcePath string, personaName string, messageID uint) (string, error) {
    ext := filepath.Ext(sourcePath)
    if !isValidImageExt(ext) {
        return "", fmt.Errorf("unsupported image type: %s (use png, jpg, gif, webp)", ext)
    }

    filename := fmt.Sprintf("%s_%d%s", personaName, messageID, ext)
    destPath := filepath.Join(GetImageStorageDir(), filename)

    src, err := os.Open(sourcePath)
    if err != nil {
        return "", fmt.Errorf("could not open source image: %w", err)
    }
    defer src.Close()

    dst, err := os.Create(destPath)
    if err != nil {
        return "", fmt.Errorf("could not create dest image: %w", err)
    }
    defer dst.Close()

    if _, err := io.Copy(dst, src); err != nil {
        return "", fmt.Errorf("could not copy image: %w", err)
    }

    return destPath, nil
}

// DeleteUserImage removes a stored image
func DeleteUserImage(imagePath string) error {
    // Safety check — only delete from our storage dir
    storageDir := GetImageStorageDir()
    if !filepath.HasPrefix(imagePath, storageDir) {
        return fmt.Errorf("refusing to delete file outside storage dir")
    }
    return os.Remove(imagePath)
}

// ResolveImagePath returns the correct absolute path for a message's image.
// Falls back to a severity-level default if the specific image is missing.
func ResolveImagePath(msg models.PersonaMessages, personaName string, severity string) string {
    // 1. Message has its own image and it exists on disk
    if msg.ImagePath != "" {
        if _, err := os.Stat(msg.ImagePath); err == nil {
            return msg.ImagePath
        }
    }

    // 2. Fall back to default image for this persona + severity
    defaultPath := filepath.Join(
        GetDefaultImageDir(),
        fmt.Sprintf("%s_%s.png", strings.ToLower(personaName), severity),
    )
    if _, err := os.Stat(defaultPath); err == nil {
        return defaultPath
    }

    // 3. Fall back to persona's global default
    globalDefault := filepath.Join(
        GetDefaultImageDir(),
        fmt.Sprintf("%s_default.png", strings.ToLower(personaName)),
    )
    if _, err := os.Stat(globalDefault); err == nil {
        return globalDefault
    }

    return "" // no image — toast fires without one
}

func isValidImageExt(ext string) bool {
    valid := map[string]bool{
        ".png": true, ".jpg": true,
        ".jpeg": true, ".gif": true, ".webp": true,
    }
    return valid[strings.ToLower(ext)]
}