package models

type Invention struct {
	Name        string  `json:"name" db:"name"`
	Description string  `json:"description" db:"description"`
	HtmlCode    *string `json:"html_code,omitempty" db:"html"`
}
