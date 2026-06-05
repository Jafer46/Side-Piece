package main

import (
	"context"
	"side_piece/db"
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
