package git

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	gogit "github.com/go-git/go-git/v5"
)


type ScanResult struct {
    Path     string `json:"path"`
    Name     string `json:"name"`
    LastCommit string `json:"last_commit"` // formatted string e.g. "2 days ago"
    Branch   string `json:"branch"`
}

func shouldSkipDir(name string) bool {
	skip := map[string]bool{
		"node_modules":  true,
		"vendor":        true,
		".cache":        true,
		"dist":          true,
		"build":         true,
		".npm":          true,
		".cargo":        true,
		"target":        true, // Rust build output
		"__pycache__":   true,
		".venv":         true,
		"venv":          true,
		".idea":         true,
		".vscode":       true,
		"AppData":       true,
		"Windows":       true,
		"Program Files": true,
	}
	return strings.HasPrefix(name, ".") && name != ".git" || skip[name]
}


func getSearchRoots() []string {
    home, _ := os.UserHomeDir()

    roots := []string{
        filepath.Join(home, "projects"),
        filepath.Join(home, "Projects"),
        filepath.Join(home, "dev"),
        filepath.Join(home, "Dev"),
        filepath.Join(home, "code"),
        filepath.Join(home, "Code"),
        filepath.Join(home, "repos"),
        filepath.Join(home, "workspace"),
        filepath.Join(home, "Documents", "projects"),
        filepath.Join(home, "Documents", "Projects"),
        filepath.Join(home, "Desktop"),
        "C:\\projects",
        "C:\\dev",
        "C:\\code",
        "C:\\repos",
    }

    return roots
}


func buildScanResult(repoPath string) ScanResult {
    result := ScanResult{
        Path: repoPath,
        Name: filepath.Base(repoPath),
    }

    // Try to get branch + last commit info — non-fatal if it fails
    repo, err := gogit.PlainOpen(repoPath)
    if err != nil {
        return result
    }

    ref, err := repo.Head()
    if err != nil {
        return result
    }

    result.Branch = ref.Name().Short()

    commit, err := repo.CommitObject(ref.Hash())
    if err != nil {
        return result
    }

    result.LastCommit = timeAgo(commit.Author.When)
    return result
}

func timeAgo(t time.Time) string {
    diff := time.Since(t)
    switch {
    case diff < time.Hour:
        return "just now"
    case diff < 24*time.Hour:
        h := int(diff.Hours())
        return fmt.Sprintf("%dh ago", h)
    case diff < 7*24*time.Hour:
        d := int(diff.Hours() / 24)
        return fmt.Sprintf("%dd ago", d)
    case diff < 30*24*time.Hour:
        w := int(diff.Hours() / 24 / 7)
        return fmt.Sprintf("%dw ago", w)
    default:
        return t.Format("Jan 2006")
    }
}