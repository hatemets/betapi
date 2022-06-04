import { pinnacle } from "../constants.js"
import fetchData from "./fetchData.js"
import cleanData from "./cleanData.js"
import getLeagues from "./getLeagues.js"

const { baseUrl, matchupUrl, irrelevantKeys } = pinnacle

// Parse through league ids and get the corresponding matches
const getMatchups = async (writeToFile = false) => {
    // The collection of all matchups
    const matchups = []

    // Get the leagues
    const leagues = await getLeagues()
    const leagueIds = leagues.map(league => league.id)

    // Collect the matchups for each league
    for (const id of leagueIds) {
        try {
            const matchup = await getSingleMatchup(id)
            matchups.push(matchup)
        }
        catch (err) {
            console.error(err)
        }
    }

    if (writeToFile) {
        fs.writeFileSync("./data/pinnacle/matchups.json", JSON.stringify(matchups, null, "\t"))
    }

    return matchups
}


// Fetch the matchups for a specific league
const getSingleMatchup = async leagueId => {
    const url = `${baseUrl}/leagues/${leagueId}/matchups`

    // Make the request
    const response = await fetchData(url)
    // Clean the data
    const cleaned = cleanData(response.data, irrelevantKeys.matchups)

    return cleaned
}


export default getMatchups
