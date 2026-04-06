package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
	"v1/app/services"
)

func GetRegionInventionHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	regionCode := vars["regionCode"]
	result := services.GetInventionsByRegion(regionCode)
	w.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(result)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}
