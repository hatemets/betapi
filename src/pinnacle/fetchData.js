import axios from "axios"
import { pinnacle } from "../constants.js"

const { apiKey } = pinnacle

const fetchData = async url => {
    const headers = {
        "Accept": "application/json", 
        "Content-Type": "application/json", 
        "x-api-key": apiKey,
        "Origin": "https://www.pinnacle.com", 
        "User-Agent": "Mozilla/5.0 (X11 Linux x86_64 rv:97.0) Gecko/20100101 Firefox/97.0", 
        "Referer": "https://www.pinnacle.com/", 
    }

    try {
        const res = await axios.get(url, { headers })
        return res
    }
    catch (err) {
        throw new Error("explanation", { cause: err })
    }
}


export default fetchData
