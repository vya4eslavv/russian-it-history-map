package main

import (
	ghandlers "github.com/gorilla/handlers"
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

	corsObj := ghandlers.AllowedOrigins([]string{"*"})
	corsMethods := ghandlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"})
	corsHeaders := ghandlers.AllowedHeaders([]string{"Content-Type", "Authorization"})

	serErr := http.ListenAndServe("localhost:8080", ghandlers.CORS(corsObj, corsMethods, corsHeaders)(muxRouter))
	if serErr != nil {
		panic(serErr)
	}
}
