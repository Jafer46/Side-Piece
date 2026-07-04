// notifications/severity.go
package notifications

import (
	"fmt"
	"math"
	"side_piece/backend/db/models"
	"time"
)

// Thresholds — tweak these to taste
const (
    MildHours      = 24   // 1 day
    SeriousHours   = 72   // 3 days
    AbandonedHours = 168  // 7 days

    MildCommits      = 1
    SeriousCommits   = 3
    AbandonedCommits = 7
)

// ComputeSeverity takes a project and returns the severity level
// Uses BOTH time and missed commits — whichever is worse wins
func ComputeSeverity(p models.Project) models.SeverityLevel {
    hoursMissed := hoursSinceCommit(p)
    commitsMissed := estimateMissedCommits(p, hoursMissed)

    // Whichever metric is worse drives the severity
    timeSeverity   := severityFromHours(hoursMissed)
    commitSeverity := severityFromCommits(commitsMissed)

    level := worstOf(timeSeverity, commitSeverity)

    return models.SeverityLevel{
        Level:         level,
        HoursMissed:   hoursMissed,
        CommitsMissed: commitsMissed,
        Label:         buildLabel(hoursMissed, commitsMissed),
    }
}

func severityFromHours(hours float64) string {
    switch {
    case hours >= AbandonedHours:
        return "abandoned"
    case hours >= SeriousHours:
        return "serious"
    case hours >= MildHours:
        return "mild"
    default:
        return ""
    }
}

func severityFromCommits(missed int) string {
    switch {
    case missed >= AbandonedCommits:
        return "abandoned"
    case missed >= SeriousCommits:
        return "serious"
    case missed >= MildCommits:
        return "mild"
    default:
        return ""
    }
}

// worstOf returns the more severe of two levels
func worstOf(a, b string) string {
    rank := map[string]int{"": 0, "mild": 1, "serious": 2, "abandoned": 3}
    if rank[b] > rank[a] {
        return b
    }
    return a
}

// estimateMissedCommits estimates how many commits were expected
// based on the project's nag interval as a proxy for commit frequency
func estimateMissedCommits(p models.Project, hoursMissed float64) int {
    if p.NagIntervalHours <= 0 {
        return 0
    }
    return int(math.Floor(hoursMissed / float64(p.NagIntervalHours)))
}

func hoursSinceCommit(p models.Project) float64 {
    if p.LastCommitAt != nil {
        return time.Since(*p.LastCommitAt).Hours()
    }
    return time.Since(p.CreatedAt).Hours()
}

func buildLabel(hours float64, commits int) string {
    days := hours / 24
    timeStr := ""
    switch {
    case hours < 24:
        timeStr = fmt.Sprintf("%.0f hours", hours)
    case days < 7:
        timeStr = fmt.Sprintf("%.0f days", days)
    default:
        timeStr = fmt.Sprintf("%.0f weeks", days/7)
    }

    if commits > 0 {
        return fmt.Sprintf("%s, ~%d missed commits", timeStr, commits)
    }
    return timeStr
}