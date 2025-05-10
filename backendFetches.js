async function fetchData(url){
    let result = await fetch(url);
    return result.json()
}


fetchData("http://localhost:8080/api/invention/get/13").then(data => {
    document.getElementById("map").innerHTML += data.html_code;
})


fetchData("http://localhost:8080/api/invention/get/2").then(data => {
    document.getElementById("map").innerHTML += data.html_code;
})

fetchData("http://localhost:8080/api/invention/get/11").then(data => {
    document.getElementById("map").innerHTML += data.html_code;
})