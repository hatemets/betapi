import { pinnacle } from "../constants.js"

const cleanMatchupData = matchups => {
    const cleanedMatchups = []

    for (const matchup of Object.entries(matchups)) {
        const matchupObj = matchup[1]

        // Remove irrelevant keys from the matchups object
        pinnacle.irrelevantKeys.forEach(key => delete matchupObj[key])

        // Insert the cleaned matchup object to the array
        cleanedMatchups.push(matchupObj)
    }

    return cleanedMatchups
}


export default cleanMatchupData
