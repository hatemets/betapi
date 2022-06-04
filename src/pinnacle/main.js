import fs from "fs"
import fetchData from "./fetchData.js"
import { removeCircularReferences } from "../helper.js"
import cleanData from "./cleanData.js"
import getLeagues from "./getLeagues.js"
import getMatchups from "./getMatchups.js"


const run = async () => {
    const matchups = await getMatchups(false)
}

export default run
