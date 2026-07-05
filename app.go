package main

import (
	"context"
	"side_piece/backend/db"
	"side_piece/backend/db/models"
	"side_piece/backend/git"
	notifications "side_piece/backend/notification"
	"side_piece/backend/scheduler"

	"gorm.io/gorm"
)

// App struct
type App struct {
    ctx context.Context
    db  *gorm.DB
    scheduler *scheduler.Scheduler
}

// NewApp creates a new App application struct
func NewApp(database *gorm.DB) *App {
    app := &App{db: database}

    app.scheduler = scheduler.New(database, func(project models.Project, reason string) {
        notifications.Send(database, project, models.SeverityLevel{
            
        })

    })
	return app
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

     // Check for missed nags first (PC was off)
    a.scheduler.CheckMissedJobs()

    // Then start the ongoing cron
    a.scheduler.Start()
}

func (a *App) shutdown(ctx context.Context) {
    a.scheduler.Stop()
}

// --- Projects ---

func (a *App) GetProjects() ([]models.Project, error) {
    return db.GetAllProjects(a.db)
}

func (a *App) AddProject(name string, path string, status string, personaId uint, nagInterval int) (models.Project, error) {
    return db.AddProject(a.db, models.Project{
        Name:             name,
        Path:             path,
        Status:           status,
        PersonaID:        personaId,
        NagIntervalHours: nagInterval,
    })
}

func (a *App) DeleteProject(id uint) error {
    return db.DeleteProject(a.db,id)
}

func (a *App) UpdateProjectStatus(id uint, status string) error {
    return db.UpdateStatus(a.db, id, status)
}


func (a *App) GetAllPersonas() ([]models.Persona,error) {
    return db.GetAllPersona(a.db)
}

func (a *App) AddPersona(name string, gender string) (models.Persona, error) {
    return db.AddPersona(a.db, models.Persona{
        Name:   name,
        Gender: gender,
    })
}

func (a *App) DeletePersona(id uint) error {
    return db.DeletePersona(a.db, id)
}

func (a *App) GetAllPersonaMessages()([]models.PersonaMessages,error){
    return db.GetAllPersonaMessages(a.db)
}

func (a *App) GetMessagesByPerson(personID uint)([]models.PersonaMessages, error){
    return db.GetMessagesByPersona(a.db, personID)
}

func (a *App) AddPersonaMessages(
    personaID uint, 
    message string, 
    messageType string,
    character string,
)(models.PersonaMessages, error) {
    return db.AddPersonaMessages(a.db, models.PersonaMessages{
        PersonaID: personaID,
        Message: message,
        MessageType: messageType,
        Character: character,
    })
}

func (a *App) DeletePersonaMessages(id uint) error {
    return db.DeletePersonaMessages(a.db, id)
}

func (a *App) GetAllRepos() ([]models.DiscoveredRepos, error) {
    return db.GetAllRepos(a.db)
}

func (a *App) ScanAndCache() ([]git.ScanResult, error) {
    results, err := git.ScanForRepos()
    if err != nil {
        return nil, err
    }

    for _, r := range results {
        _, error := db.AddRepo(a.db, 
            models.DiscoveredRepos{
            Name:      r.Name,
            Path:      r.Path,
            Branch:    r.Branch,
            LastCommit: r.LastCommit,
        })
        if error != nil {
            continue
        }
    }

    return results, nil
}