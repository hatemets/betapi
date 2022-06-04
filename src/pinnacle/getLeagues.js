import { pinnacle } from "../constants.js"
import fetchData from "./fetchData.js"
import cleanData from "./cleanData.js"

const { baseUrl, leaguesUrl, irrelevantKeys } = pinnacle

// Returns an array of league objects
const getLeagues = async () => {
    const url = baseUrl + leaguesUrl
    const response = await fetchData(url)
    const cleanedLeagues = cleanData(response.data, irrelevantKeys.leagues)
    return cleanedLeagues
}


export default getLeagues
