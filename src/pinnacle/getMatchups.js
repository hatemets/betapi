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
            if (matchup === undefined) {
                console.log(`${id} does not have publicly available matchups`)
            }
            else {
                matchups.push(matchup)
            }
        }
        catch (err) {
            console.error(err)
        }
    }

    if (writeToFile) {
        fs.writeFileSync("./data/pinnacle/matchups.json", JSON.stringify(matchups, null, "\t"))
    }

    console.log(matchups)
    console.log(matchups.length)

    return matchups
}


// Fetch the matchups for a specific league
const getSingleMatchup = async leagueId => {
    const url = `${baseUrl}/leagues/${leagueId}/matchups`

    try {
        // Make the request
        const response = await fetchData(url)
        // Clean the data
        const cleaned = cleanData(response.data, irrelevantKeys.matchups)

        return cleaned
    }
    catch (err) {
        // Access denied (403) for this route
        return undefined
    }
}


export default getMatchups
