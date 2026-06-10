package main

import (
	"context"
	"side_piece/db"
	"side_piece/db/models"
	"side_piece/git"

	"gorm.io/gorm"
)

// App struct
type App struct {
    ctx context.Context
    db  *gorm.DB
}

// NewApp creates a new App application struct
func NewApp(database *gorm.DB) *App {
	return &App{db: database}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
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