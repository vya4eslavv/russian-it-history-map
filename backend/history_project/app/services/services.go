package services

import (
	"github.com/jmoiron/sqlx"
	_ "github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"v1/app/models"
)

var db *sqlx.DB

func InititalizeDB() {
	dbc := "user=egorikRoot" + " password=RootRoot" + " dbname=postgres" + " sslmode=disable"
	conn, err := sqlx.Connect("postgres", dbc)
	if err != nil {
		panic(err)
	}
	db = conn
}

func GetInvention(invId uint) models.Invention {
	var result models.Invention
	err := db.Get(&result, "select name, description from inventions where id = $1", invId)
	if err != nil {
		panic(err)
	}

	return result
}

func CloseDB() {
	err := db.Close()
	if err != nil {
		panic(err)
	}
}
