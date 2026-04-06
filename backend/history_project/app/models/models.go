package models

type ResponseRegionInventions struct {
	Region     Region      `json:"region"`
	Inventions []Invention `json:"inventions"`
}

type Region struct {
	Code        string `json:"code" db:"code"`
	Name        string `json:"name" db:"name"`
	Description string `json:"description" db:"description"`
}

type Invention struct {
	ID              int    `json:"id" db:"id"`
	Slug            string `json:"slug" db:"slug"`
	Name            string `json:"name" db:"title"`
	Inventor        string `json:"inventor" db:"inventor"`
	Period          string `json:"period" db:"period_text"`
	LocationName    string `json:"location_name" db:"location_name"`
	Description     string `json:"description" db:"description"`
	ImageURL        string `json:"image_url" db:"image_url"`
	FullDescription string `json:"full_description" db:"full_description"`
}
