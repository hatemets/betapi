import axios from "axios"

var config = {
    method: "get",
    url: "https://guest.api.arcadia.pinnacle.com/0.1/leagues/201371/matchups",
    headers: { 
        "User-Agent": "Mozilla/5.0 (X11 Linux x86_64 rv:97.0) Gecko/20100101 Firefox/97.0", 
        "Accept": "application/json", 
        "Referer": "https://www.pinnacle.com/", 
        "Content-Type": "application/json", 
        "Origin": "https://www.pinnacle.com", 
        "x-api-key": "CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R"
    }
}

axios(config)
    .then(function (response) {
        console.log(response.data)
    })
    .catch(function (error) {
        console.log(error)
    })
