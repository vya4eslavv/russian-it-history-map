package handlers

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"net/http"
	"strconv"
	"v1/app/services"
)

func GetInventionHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	parsedID, err := strconv.ParseUint(id, 10, 64)
	if err != nil {
		panic(err)
	}

	inventionData := services.GetInvention(uint(parsedID))
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	err = json.NewEncoder(w).Encode(inventionData)
	if err != nil {
		panic(err)
	}
}
