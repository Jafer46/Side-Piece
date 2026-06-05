package models

import "time"

type Project struct {
    ID             int64     `db:"id"`
    Name           string    `db:"name"`
    Path           string    `db:"path"`
    Status         string    `db:"status"`    // "active", "idle", "abandoned", "paused"
    LastCommitAt   *time.Time `db:"last_commit_at"`
    LastNagAt      *time.Time `db:"last_nag_at"`
    NagIntervalHours int      `db:"nag_interval_hours"`
    CreatedAt      time.Time  `db:"created_at"`
	PersonaID      int64     `db:"persona_id"`
}

type Persona struct {
	ID        int64     `db:"id"`
	Name      string    `db:"name"`
	Gender string    `db:"gender"`
	CreatedAt time.Time `db:"created_at"`
}

type PersonaMessages struct {
	ID        	int64     `db:"id"`
	PersonaID 	int64     `db:"persona_id"`
	Message   	string    `db:"message"`
	MessageType string    `db:"message_type"`
	Character 	string    `db:"character"`
}

type NotificationLog struct {
    ID        int64     `db:"id"`
    ProjectID int64     `db:"project_id"`
    Message   string    `db:"message"`
    Character string    `db:"character"`
    SnoozedTo *time.Time `db:"snoozed_to"`
    SentAt    time.Time  `db:"sent_at"`
}

type CronLog struct {
	ID        int64     `db:"id"`
	JobName   string    `db:"job_name"`
	Status    string    `db:"status"`
	RanAt    time.Time  `db:"ran_at"`
}