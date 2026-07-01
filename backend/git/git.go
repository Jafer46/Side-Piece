package git

import (
	"os"
	"path/filepath"
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