package services

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	_ "github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"v1/app/models"
)

var db *sqlx.DB

func InititalizeDB() {
	dbc := "port=1488 " + "user=slava" + " password=slava" + " dbname=postgres" + " sslmode=disable"
	conn, err := sqlx.Connect("postgres", dbc)
	if err != nil {
		panic(err)
	}
	db = conn
}

func GetInvention(invId uint) models.Invention {
	var result models.Invention
	err := db.Get(&result, "select name, description, html from inventions where id = $1", invId)
	if err != nil {
		panic(err)
	}

	fmt.Println("Get (GetInvention):", result)

	return result
}

func CloseDB() {
	err := db.Close()
	if err != nil {
		panic(err)
	}
}
