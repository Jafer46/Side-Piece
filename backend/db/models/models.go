package models

import (
	"time"

	"gorm.io/gorm"
)

type Project struct {
	gorm.Model 
    Name           string    
    Path           string    
    Status         string      
    LastCommitAt   *time.Time 
    LastNagAt      *time.Time 
    NagIntervalHours int
	PersonaID 		uint      
	Persona 		Persona `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"` 
	SnoozedUntil   *time.Time       
}

type ProjectCommit struct {
	gorm.Model 
	ProjectID 	uint     
	Project   	Project  `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	CommitType 	string    
	Branch    	string    
	Message   	string    
}

type Persona struct {
	gorm.Model   
	Name        string    
	Gender 	    string    
	Color       string    
	Emoji       string    
	Description string    
}

type PersonaMessages struct {
	gorm.Model 
	PersonaID 	uint
	Persona   	Persona `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`     
	Message   	string    
	MessageType string    
	Character 	string    
}

type NotificationLog struct {
	gorm.Model  
    ProjectID uint     
    Message   string    
    Character string    
    SnoozedTo *time.Time 
    SentAt    time.Time  
}

type CronLog struct {
	gorm.Model   
	JobName   string    
	Status    string    
	RanAt    time.Time
	Note      string  
}

type DiscoveredRepos struct {
	gorm.Model  
	Name      string    
	Path      string    
	Branch    string    
	LastCommit string    
}