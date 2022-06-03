import axios from "axios"
import { pinnacle } from "../constants.js"

const { baseUrl, apiKey, matchupUrl } = pinnacle

const fetchData = async () => {
    const headers = {
        "Accept": "application/json", 
        "Content-Type": "application/json", 
        "x-api-key": apiKey
    }

    try {
        const res = await axios.get(baseUrl + matchupUrl, { headers })
        return res
    }
    catch (err) {
        console.error("Error fetching pinnacle data")
        console.error(err)
    }
}


export default fetchData
