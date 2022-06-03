import { pinnacle } from "../constants.js"


// The data is an object and redundantKeys is an array containing the names of the redundant keys
const cleanData = (data, redundantKeys) => {
    const cleanedMatchups = []

    for (const matchup of Object.entries(data)) {
        // The second entry is the actual object (the first entry is an index related to the object)
        const matchupObj = matchup[1]

        // Remove irrelevant keys from the matchups object
        redundantKeys.forEach(key => delete matchupObj[key])

        // Insert the cleaned matchup object to the array
        cleanedMatchups.push(matchupObj)
    }

    return cleanedMatchups
}


export default cleanData
