package main

import (
	"context"
	"side_piece/db"
	"side_piece/git"
	"side_piece/models"

	"github.com/jmoiron/sqlx"
)

// App struct
type App struct {
    ctx context.Context
    db  *sqlx.DB
}

// NewApp creates a new App application struct
func NewApp(database *sqlx.DB) *App {
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

func (a *App) AddProject(name string, path string, personaId int, nagInterval int) (int64, error) {
    return db.AddProject(a.db, models.Project{
        Name:             name,
        Path:             path,
        PersonaID:        int64(personaId),
        NagIntervalHours: nagInterval,
    })
}

func (a *App) DeleteProject(id int64) error {
    return db.DeleteProject(a.db, id)
}

func (a *App) UpdateProjectStatus(id int64, status string) error {
    return db.UpdateStatus(a.db, id, status)
}


func (a *App) GetAllPersonas() ([]models.Persona,error) {
    return db.GetAllPersona(a.db)
}

func (a *App) AddPersona(name string, gender string) (int64, error) {
    return db.AddPersona(a.db, models.Persona{
        Name:   name,
        Gender: gender,
    })
}

func (a *App) DeletePersona(id int64) error {
    return db.DeletePersona(a.db, id)
}

func (a *App) ScanAndCache() ([]git.ScanResult, error) {
    results, err := git.ScanForRepos()
    if err != nil {
        return nil, err
    }

    // Wipe old cache and store fresh results
    // a.db.Exec(`DELETE FROM discovered_repos`)
    for _, r := range results {
        _, error := db.AddRepo(a.db, models.DiscoveredRepos{
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