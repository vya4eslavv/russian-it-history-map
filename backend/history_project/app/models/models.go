package models

type Invention struct {
	Name        string `json:"name" db:"name"`
	Description string `json:"description" db:"description"`
}
