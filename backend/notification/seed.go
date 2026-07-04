// notifications/seed.go
package notifications

import (
	"side_piece/backend/db/models"

	"gorm.io/gorm"
)

type personaSeed struct {
    Persona  models.Persona
    Messages []models.PersonaMessages
}

func SeedDefaultPersonas(db *gorm.DB) error {
    seeds := []personaSeed{
        {
            Persona: models.Persona{
                Name:        "Marcus",
                Gender:      "male",
                Color:       "#7b8cde",
                Emoji:       "👨",
                Description: "Passive aggressive. Calm at first, then quietly devastating.",
            },
            Messages: []models.PersonaMessages{
                // mild — 1 day
                {Message: "Hey. Just checking in. You said you'd work on {{.ProjectName}} this week.", MessageType: "mild", IsDefault: true},
                {Message: "No pressure. I just noticed you haven't touched {{.ProjectName}} in a bit.", MessageType: "mild", IsDefault: true},
                {Message: "{{.ProjectName}} misses you. Or maybe I'm projecting.", MessageType: "mild", IsDefault: true},

                // serious — 3 days
                {Message: "It's been {{.Label}} on {{.ProjectName}}. That's fine. Everything's fine.", MessageType: "serious", IsDefault: true},
                {Message: "I told everyone about {{.ProjectName}}. They keep asking how it's going. What do I tell them?", MessageType: "serious", IsDefault: true},
                {Message: "{{.ProjectName}} is still sitting there. Waiting. Like it always does.", MessageType: "serious", IsDefault: true},

                // abandoned — 7+ days
                {Message: "{{.Label}} on {{.ProjectName}}. I'm not mad. I'm just disappointed.", MessageType: "abandoned", IsDefault: true},
                {Message: "You know what? Fine. {{.ProjectName}} doesn't need you. It'll be fine alone.", MessageType: "abandoned", IsDefault: true},
                {Message: "{{.ProjectName}}. {{.Label}}. I don't even know what to say anymore.", MessageType: "abandoned", IsDefault: true},

                // praise — after a commit following inactivity
                {Message: "Oh. You're back. {{.ProjectName}} noticed.", MessageType: "praise", IsDefault: true},
                {Message: "A commit on {{.ProjectName}}. Didn't think I'd see that. Good.", MessageType: "praise", IsDefault: true},

                // returning — first commit after abandoned status
                {Message: "{{.ProjectName}} after {{.Label}}. Bold. I respect it. Barely.", MessageType: "returning", IsDefault: true},
            },
        },
        {
            Persona: models.Persona{
                Name:        "Ava",
                Gender:      "female",
                Color:       "#e8a0bf",
                Emoji:       "👩",
                Description: "Emotionally expressive. Escalates fast. Charm mixed with guilt.",
            },
            Messages: []models.PersonaMessages{
                // mild
                {Message: "Babe. BABE. {{.ProjectName}} is just sitting there.", MessageType: "mild", IsDefault: true},
                {Message: "Hey!! So {{.ProjectName}}... are we doing this or not? 👀", MessageType: "mild", IsDefault: true},
                {Message: "I told all my friends about {{.ProjectName}}. Don't embarrass me.", MessageType: "mild", IsDefault: true},

                // serious
                {Message: "{{.Label}} on {{.ProjectName}}. Do you know how that makes me feel?", MessageType: "serious", IsDefault: true},
                {Message: "I had a whole vision for {{.ProjectName}} with you. {{.Label}} later...", MessageType: "serious", IsDefault: true},
                {Message: "We don't have to talk about {{.ProjectName}} if you don't want to. But we should.", MessageType: "serious", IsDefault: true},

                // abandoned
                {Message: "{{.Label}}. {{.ProjectName}}. I can't keep doing this.", MessageType: "abandoned", IsDefault: true},
                {Message: "I showed my sister {{.ProjectName}}. She asked if it was real. I didn't know what to say.", MessageType: "abandoned", IsDefault: true},
                {Message: "You know what hurts most about {{.ProjectName}}? It had SO much potential.", MessageType: "abandoned", IsDefault: true},

                // praise
                {Message: "YOU COMMITTED!! I knew you would!! {{.ProjectName}} is so happy rn 🎉", MessageType: "praise", IsDefault: true},
                {Message: "See?? This is why I believe in you and {{.ProjectName}}.", MessageType: "praise", IsDefault: true},

                // returning
                {Message: "After {{.Label}} you come back to {{.ProjectName}}?? I'm not crying you're crying.", MessageType: "returning", IsDefault: true},
            },
        },
        {
            Persona: models.Persona{
                Name:        "The Ghost",
                Gender:      "other",
                Color:       "#a0d4b5",
                Emoji:       "👻",
                Description: "Doesn't guilt trip. Just haunts. Glitchy, eerie, unpredictable.",
            },
            Messages: []models.PersonaMessages{
                // mild
                {Message: "{{.ProjectName}} r e m e m b e r s   y o u .", MessageType: "mild", IsDefault: true},
                {Message: "y o u   w e r e   h e r e . . .   {{.Label}}   a g o", MessageType: "mild", IsDefault: true},
                {Message: "{{.ProjectName}}. still here. still w a i t i n g.", MessageType: "mild", IsDefault: true},

                // serious
                {Message: "{{.Label}}   of   s i l e n c e   on   {{.ProjectName}}", MessageType: "serious", IsDefault: true},
                {Message: "the   l a s t   commit   echoes.   {{.ProjectName}}   feels   e m p t y.", MessageType: "serious", IsDefault: true},
                {Message: "i   counted.   {{.CommitsMissed}}   commits   you   didn't   make.", MessageType: "serious", IsDefault: true},

                // abandoned
                {Message: "{{.Label}} . . .   {{.ProjectName}}   has   f o r g o t t e n   your   name", MessageType: "abandoned", IsDefault: true},
                {Message: "y o u   l e f t   {{.ProjectName}}   u n f i n i s h e d .   again.", MessageType: "abandoned", IsDefault: true},
                {Message: "{{.ProjectName}}   w a i t s   in   the   d a r k .   {{.Label}}   now.", MessageType: "abandoned", IsDefault: true},

                // praise
                {Message: "o h .   y o u   r e t u r n e d   to   {{.ProjectName}}", MessageType: "praise", IsDefault: true},
                {Message: "a   c o m m i t .   {{.ProjectName}}   stirs.", MessageType: "praise", IsDefault: true},

                // returning
                {Message: "{{.Label}}   of   silence.   then   you   c a m e   b a c k .   curious.", MessageType: "returning", IsDefault: true},
            },
        },
    }

    for _, seed := range seeds {
        // Check if persona already exists — don't re-seed
        var count int64
        db.Model(&models.Persona{}).Where("name = ?", seed.Persona.Name).Count(&count)
        if count > 0 {
            continue
        }

        // Create persona and its messages
        if err := db.Create(&seed.Persona).Error; err != nil {
            return err
        }
        for i := range seed.Messages {
            seed.Messages[i].PersonaID = seed.Persona.ID
        }
        if err := db.Create(&seed.Messages).Error; err != nil {
            return err
        }
    }

    return nil
}