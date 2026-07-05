// notifications/toast.go
package notifications

import (
	"fmt"
	"side_piece/backend/db/models"

	"github.com/go-toast/toast"
	"gorm.io/gorm"
)

func Send(db *gorm.DB, project models.Project, severity models.SeverityLevel) {
    // 1. Pick message
    msg, rendered, err := PickMessageWithMeta(db, project, severity)
    if err != nil || rendered == "" {
        rendered = fmt.Sprintf("%s — %s", project.Name, severity.Label)
    }

    // 2. Resolve the image for this specific message
    imagePath := ResolveImagePath(msg, project.Persona.Name, severity.Level)

    // 3. Build and fire the toast
    notification := toast.Notification{
        AppID:   "Sidepiece",
        Title:   fmt.Sprintf("%s %s", project.Persona.Emoji, project.Persona.Name),
        Message: rendered,
        Icon:    imagePath, // absolute path to the image
        Actions: []toast.Action{
            {
                Type:      "protocol",
                Label:     "Snooze 4h",
                Arguments: fmt.Sprintf("sidepiece://snooze/%d/4", project.ID),
            },
            {
                Type:      "protocol",
                Label:     "Open project",
                Arguments: fmt.Sprintf("sidepiece://open/%d", project.ID),
            },
        },
    }

    if err := notification.Push(); err != nil {
        logNotification(db, project, rendered, severity.Level, "failed")
        return
    }

    logNotification(db, project, rendered, severity.Level, "sent")
}


func logNotification(db *gorm.DB,project models.Project,rendered string,severityLevel string, status string){
	
}