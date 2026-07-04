// notifications/messenger.go
package notifications

import (
	"bytes"
	"fmt"
	"math/rand"
	"text/template"
	"time"

	"side_piece/backend/db/models"

	"gorm.io/gorm"
)

type TemplateData struct {
    ProjectName   string
    Label         string
    CommitsMissed int
    PersonaName   string
    PersonaEmoji  string
}


// PickMessageWithMeta returns both the raw struct and the rendered string
// so the toast sender can access ImagePath
func PickMessageWithMeta(db *gorm.DB, project models.Project, severity models.SeverityLevel) (models.PersonaMessages, string, error) {
    var messages []models.PersonaMessages

    db.Where("persona_id = ? AND message_type = ?",
        project.PersonaID, severity.Level).
        Find(&messages)

    if len(messages) == 0 {
        db.Where("persona_id = ? AND message_type = ?",
            project.PersonaID, "serious").
            Find(&messages)
    }

    if len(messages) == 0 {
        return models.PersonaMessages{}, "", fmt.Errorf("no messages found")
    }

    rand.Seed(time.Now().UnixNano())
    msg := messages[rand.Intn(len(messages))]

    rendered, err := renderTemplate(msg.Message, TemplateData{
        ProjectName:   project.Name,
        Label:         severity.Label,
        CommitsMissed: severity.CommitsMissed,
        PersonaName:   project.Persona.Name,
        PersonaEmoji:  project.Persona.Emoji,
    })

    return msg, rendered, err
}

// PickMessage selects a random message for the persona + severity
// Falls back to serious if no messages exist for that exact level
func PickMessage(db *gorm.DB, project models.Project, severity models.SeverityLevel) (string, error) {
    var messages []models.PersonaMessages

    // Try exact severity match first
    db.Where("persona_id = ? AND message_type = ?",
        project.PersonaID, severity.Level).
        Find(&messages)

    // Fallback to "serious" if nothing found
    if len(messages) == 0 {
        db.Where("persona_id = ? AND message_type = ?",
            project.PersonaID, "serious").
            Find(&messages)
    }

    if len(messages) == 0 {
        return fmt.Sprintf("%s hasn't been touched in %s", project.Name, severity.Label), nil
    }

    // Pick a random message from the pool
    // Avoid repeating the last nag message if possible
    rand.Seed(time.Now().UnixNano())
    msg := messages[rand.Intn(len(messages))]

    return renderTemplate(msg.Message, TemplateData{
        ProjectName:   project.Name,
        Label:         severity.Label,
        CommitsMissed: severity.CommitsMissed,
        PersonaName:   project.Persona.Name,
        PersonaEmoji:  project.Persona.Emoji,
    })
}

// PickPraiseMessage picks a praise or returning message after a commit
func PickPraiseMessage(db *gorm.DB, project models.Project, wasAbandoned bool) (string, error) {
    msgType := "praise"
    if wasAbandoned {
        msgType = "returning"
    }

    var messages []models.PersonaMessages
    db.Where("persona_id = ? AND message_type = ?", project.PersonaID, msgType).
        Find(&messages)

    if len(messages) == 0 {
        return fmt.Sprintf("Nice commit on %s!", project.Name), nil
    }

    rand.Seed(time.Now().UnixNano())
    msg := messages[rand.Intn(len(messages))]

    // For praise, label can be empty
    return renderTemplate(msg.Message, TemplateData{
        ProjectName:  project.Name,
        PersonaName:  project.Persona.Name,
        PersonaEmoji: project.Persona.Emoji,
    })
}

func renderTemplate(tmpl string, data TemplateData) (string, error) {
    t, err := template.New("msg").Parse(tmpl)
    if err != nil {
        // If template parsing fails, return raw message
        return tmpl, nil
    }
    var buf bytes.Buffer
    if err := t.Execute(&buf, data); err != nil {
        return tmpl, nil
    }
    return buf.String(), nil
}