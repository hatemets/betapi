import fs from "fs"
import fetchData from "./fetchData.js"
import { removeCircularReferences } from "../helper.js"
import cleanMatchupData from "./cleaner.js"


const getData = async (writeToFile = false) => {
    const response = await fetchData()

    // if (writeToFile) {
    //     fs.writeFileSync("../../data/pinnacle/matchups.json", JSON.stringify(response, removeCircularReferences(), "\t"))
    // }

    const matchups = cleanMatchupData(response.data)

    return matchups
}

export default getData
