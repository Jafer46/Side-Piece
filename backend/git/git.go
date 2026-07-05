package git

import (
	"fmt"
	"os"
	"path/filepath"
	"side_piece/backend/db/models"
	"time"

	gogit "github.com/go-git/go-git/v5"
	"gorm.io/gorm"
)

// ScanForRepos walks common dev directories and finds all git repos
func ScanForRepos() ([]ScanResult, error) {
    // Common places devs keep projects on Windows
    searchRoots := getSearchRoots()

    var results []ScanResult
    seen := map[string]bool{}

    for _, root := range searchRoots {
        // Don't error if a root doesn't exist
        if _, err := os.Stat(root); err != nil {
            continue
        }

        filepath.WalkDir(root, func(path string, d os.DirEntry, err error) error {
            if err != nil {
                return filepath.SkipDir
            }

            // Skip hidden dirs and node_modules / vendor etc
            name := d.Name()
            if d.IsDir() && shouldSkipDir(name) {
                return filepath.SkipDir
            }

            // If we find a .git folder, the parent is a repo
            if d.IsDir() && name == ".git" {
                repoPath := filepath.Dir(path)

                if seen[repoPath] {
                    return filepath.SkipDir
                }
                seen[repoPath] = true

                result := buildScanResult(repoPath)
                results = append(results, result)

                // Don't recurse into repos looking for nested repos
                return filepath.SkipDir
            }

            return nil
        })
    }

    return results, nil
}

// git/git.go

func UpdateLastCommit(db *gorm.DB, project models.Project) (models.Project, error) {
    // 1. Open the repo at the project's path
    repo, err := gogit.PlainOpen(project.Path)
    if err != nil {
        return project, fmt.Errorf("could not open repo at %s: %w", project.Path, err)
    }

    // 2. Get HEAD
    ref, err := repo.Head()
    if err != nil {
        return project, fmt.Errorf("could not get HEAD for %s: %w", project.Name, err)
    }

    // 3. Get the latest commit
    commit, err := repo.CommitObject(ref.Hash())
    if err != nil {
        return project, fmt.Errorf("could not get commit for %s: %w", project.Name, err)
    }

    // 4. Update the DB
    commitTime := commit.Author.When

    status := getStats(commitTime, project)


    result := db.Model(&project).UpdateColumns(models.Project{
        Status: status,
        LastCommitAt: &commitTime,
    })

    if result.Error != nil {
        return project, fmt.Errorf("could not update last_commit_at for %s: %w", project.Name, result.Error)
    }


    // 5. Return the updated project
    project.LastCommitAt = &commitTime
    return project, nil
}

func getStats(commitTime time.Time, project models.Project)(string){
    now := time.Now()

    if project.SnoozedUntil != nil && now.Before(*project.SnoozedUntil) {
        return "paused"
    }
    hours := time.Since(commitTime).Hours()
    
    if (hours < float64(project.NagIntervalHours)){
        return "active"
    } 
    
    if(hours < float64(project.NagIntervalHours)*2){
        return "idle"
    }

    return "abandoned"
}



// BrowseForRepo opens a native folder picker dialog
// func (a *App) BrowseForRepo() (ScanResult, error) {
//     path, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
//         Title:                "Select your project folder",
//         CanCreateDirectories: false,
//     })
//     if err != nil || path == "" {
//         return ScanResult{}, nil // user cancelled
//     }

//     // Check it's actually a git repo
//     if _, err := gogit.PlainOpen(path); err != nil {
//         return ScanResult{}, fmt.Errorf("no git repository found at: %s", path)
//     }

//     return buildScanResult(path), nil
// }