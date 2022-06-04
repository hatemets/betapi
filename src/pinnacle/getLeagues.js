import { pinnacle } from "../constants.js"
import fetchData from "./fetchData.js"
import cleanData from "./cleanData.js"

const { baseUrl, leaguesUrl, irrelevantKeys } = pinnacle

// Returns an array of league objects
const getLeagues = async (writeToFile = false) => {
    const url = baseUrl + leaguesUrl
    const response = await fetchData(url)
    const cleanedLeagues = cleanData(response.data, irrelevantKeys.leagues)

    if (writeToFile) {
        fs.writeFileSync("./data/pinnacle/leagues.json", JSON.stringify(cleanedLeagues, null, "\t"))
    }

    return cleanedLeagues
}


export default getLeagues
