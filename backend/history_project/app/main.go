package main

import (
	"github.com/gorilla/mux"
	"net/http"
	"v1/app/handlers"
	"v1/app/services"
)

func main() {
	services.InititalizeDB()
	defer services.CloseDB()

	muxRouter := mux.NewRouter()
	muxRouter.StrictSlash(true)
	muxRouter.HandleFunc("/api/invention/get/{id:[0-9]+}", handlers.GetInventionHandler).Methods("GET")

	serErr := http.ListenAndServe("localhost:8080", muxRouter)
	if serErr != nil {
		panic(serErr)
	}
}
