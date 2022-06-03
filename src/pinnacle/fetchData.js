import axios from "axios"
import { pinnacle } from "../constants.js"

const { apiKey } = pinnacle

const fetchData = async url => {
    const headers = {
        "Accept": "application/json", 
        "Content-Type": "application/json", 
        "x-api-key": apiKey
    }

    try {
        const res = await axios.get(url, { headers })
        return res
    }
    catch (err) {
        console.error("Error fetching pinnacle data")
        console.error(err)
    }
}


export default fetchData
