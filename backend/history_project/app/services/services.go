package services

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	_ "github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"os"
	"v1/app/models"
)

var db *sqlx.DB

func InititalizeDB() {
	host := getEnv("DB_HOST", "localhost")
	port := getEnv("DB_PORT", "1488")
	user := getEnv("DB_USER", "slava")
	password := getEnv("DB_PASSWORD", "slava")
	dbname := getEnv("DB_NAME", "postgres")
	sslmode := getEnv("DB_SSLMODE", "disable")

	dbc := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, password, dbname, sslmode,
	)

	conn, err := sqlx.Connect("postgres", dbc)
	if err != nil {
		panic(err)
	}

	db = conn
}

func getEnv(key, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	return value
}

func GetInventionsByRegion(regionCode string) models.ResponseRegionInventions {
	var result models.ResponseRegionInventions

	var region models.Region
	var inventions []models.Invention

	queryAchievements := `select
    a.id,
    a.slug,
    a.title,
	coalesce(a.inventor, '') as inventor,
    coalesce(a.period_text, '') as period_text,
    coalesce(a.location_name, '') as location_name,
    coalesce(a.description, '') as description,
    coalesce(a.image_url, '') as image_url,
    a.full_description
	from achievements a
	join regions r on a.region_id = r.id
	where lower(r.code) = lower($1)
	order by a.sort_order asc, a.title asc`

	err := db.Select(&inventions, queryAchievements, regionCode)
	if err != nil {
		fmt.Println(err)
	}

	queryRegion := `select
		r.code as code,
		r.name as name
		from regions r
		where lower(r.code) = lower($1)
	`

	err = db.Get(&region, queryRegion, regionCode)
	if err != nil {
		fmt.Println(err)
	}

	result.Region = region
	result.Inventions = inventions
	return result
}

func CloseDB() {
	err := db.Close()
	if err != nil {
		panic(err)
	}
}
