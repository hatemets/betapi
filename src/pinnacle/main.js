import fs from "fs"
import fetchData from "./fetchData.js"
import { removeCircularReferences } from "../helper.js"
import cleanData from "./cleanData.js"
import getLeagues from "./getLeagues.js"
import getMatchups from "./getMatchups.js"


const getData = async (writeToFile = false) => {
    const matchups = await getMatchups()
    const leagues = await getLeagues()

    if (writeToFile) {
        fs.writeFileSync("./data/pinnacle/leagues.json", JSON.stringify(leagues, null, "\t"))
        fs.writeFileSync("./data/pinnacle/matchups.json", JSON.stringify(matchups, null, "\t"))
    }

    // const matchups = cleanData(response.data)
    // return matchups
}

export default getData
