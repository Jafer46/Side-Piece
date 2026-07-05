package scheduler

import (
	"fmt"
	"log"
	"side_piece/backend/db/models"
	"side_piece/backend/git"
	"time"

	"github.com/robfig/cron/v3"
	"gorm.io/gorm"
)

type Scheduler struct {
    db       *gorm.DB
    cron     *cron.Cron
    // callback to fire a notification — wired up in app.go
    onNag    func(project models.Project, reason string)
}

func New(db *gorm.DB, onNag func(models.Project, string)) *Scheduler {
    return &Scheduler{
        db:    db,
        cron:  cron.New(cron.WithSeconds()), // second-level precision
        onNag: onNag,
    }
}

// Start boots the scheduler and registers the inactivity check job
func (s *Scheduler) Start() {
    // Check every 30 minutes — lightweight, just reads from DB
    s.cron.AddFunc("0 */30 * * * *", func() {
        s.runInactivityCheck("scheduled")
    })

    s.cron.Start()
    log.Println("scheduler started — checking every 30 minutes")
}

func (s *Scheduler) Stop() {
    s.cron.Stop()
}

// CheckMissedJobs is called once on startup to handle offline periods
func (s *Scheduler) CheckMissedJobs() {
    log.Println("checking for missed nags during offline period...")
    s.runInactivityCheck("startup")
}

// runInactivityCheck is the core nag logic — called by cron AND on startup
func (s *Scheduler) runInactivityCheck(trigger string) {
    var projects []models.Project
    result := s.db.Preload("Persona").
        Where("status != ?", "paused").
        Find(&projects)

    if result.Error != nil {
        s.logCron("inactivity_check", "failed", trigger, result.Error.Error())
        return
    }

    nagged := 0
    skipped := 0

    for _, project := range projects {
        outcome := s.evaluateProject(project, trigger)
        if outcome == "nagged" {
            nagged++
        } else {
            skipped++
        }
    }

    note := fmt.Sprintf("trigger=%s nagged=%d skipped=%d", trigger, nagged, skipped)
    s.logCron("inactivity_check", "success", trigger, note)
    log.Printf("inactivity check done: %s", note)
}

// evaluateProject decides whether to nag a single project
func (s *Scheduler) evaluateProject(p models.Project, trigger string) string {
    now := time.Now()

    // 1. Skip if snoozed
    if p.SnoozedUntil != nil && now.Before(*p.SnoozedUntil) {
        log.Printf("[%s] snoozed until %s — skipping", p.Name, p.SnoozedUntil.Format("15:04"))
        return "skipped"
    }
    updated, err := git.UpdateLastCommit(s.db,p)
    if err != nil {
        log.Printf("[%s] could not refresh commit date: %v", p.Name, err)
    } else {
        p = updated // use the fresh data for all checks below
    }
    // 2. Calculate hours since last activity
    hoursSinceCommit := s.hoursSinceLastCommit(p)
    threshold := float64(p.NagIntervalHours)

    // 3. Not inactive enough yet — no nag
    if hoursSinceCommit < threshold {
        log.Printf("[%s] only %.1fh inactive (threshold: %.0fh) — skipping",
            p.Name, hoursSinceCommit, threshold)
        return "skipped"
    }

    // 4. Already nagged recently? Don't double-nag
    if p.LastNagAt != nil {
        hoursSinceNag := now.Sub(*p.LastNagAt).Hours()
        // Don't nag again until at least half the interval has passed
        if hoursSinceNag < threshold/2 {
            log.Printf("[%s] already nagged %.1fh ago — skipping", p.Name, hoursSinceNag)
            return "skipped"
        }
    }

    // 5. All checks passed — fire the nag
    reason := s.buildReason(p, hoursSinceCommit)
    log.Printf("[%s] nagging — %.1fh inactive, reason: %s", p.Name, hoursSinceCommit, reason)

    // Update last_nag_at and status
    s.db.Model(&p).Updates(map[string]interface{}{
        "last_nag_at": now,
        "status":      s.inferStatus(hoursSinceCommit),
    })

    // Fire the notification
    if s.onNag != nil {
        s.onNag(p, reason)
    }

    return "nagged"
}

// hoursSinceLastCommit returns hours since last commit, or since registration if never committed
func (s *Scheduler) hoursSinceLastCommit(p models.Project) float64 {
    if p.LastCommitAt != nil {
        return time.Since(*p.LastCommitAt).Hours()
    }
    // Never committed — measure from when project was registered
    return time.Since(p.CreatedAt).Hours()
}

// inferStatus maps inactivity hours to a project status
func (s *Scheduler) inferStatus(hoursSinceCommit float64) string {
    switch {
    case hoursSinceCommit < 48:
        return "active"
    case hoursSinceCommit < 168: // 7 days
        return "idle"
    default:
        return "abandoned"
    }
}

// buildReason gives context about WHY the nag is firing — used in notification message
func (s *Scheduler) buildReason(p models.Project, hours float64) string {
    days := hours / 24
    switch {
    case hours < 24:
        return fmt.Sprintf("%.0f hours without a commit", hours)
    case days < 7:
        return fmt.Sprintf("%.0f days without a commit", days)
    case days < 30:
        weeks := int(days / 7)
        return fmt.Sprintf("%d week(s) without a commit", weeks)
    default:
        months := int(days / 30)
        return fmt.Sprintf("%d month(s) of neglect", months)
    }
}

// SnoozeProject pauses nags for a project until a given time
func (s *Scheduler) SnoozeProject(projectID uint, until time.Time) error {
    return s.db.Model(&models.Project{}).
        Where("id = ?", projectID).
        Update("snoozed_until", until).Error
}

// logCron writes a record of every job run to the DB
func (s *Scheduler) logCron(jobName, status, trigger, note string) {
    s.db.Create(&models.CronLog{
        JobName: jobName,
        Status:  status,
        RanAt:   time.Now(),
        Note:    fmt.Sprintf("trigger=%s %s", trigger, note),
    })
}