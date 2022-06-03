import fs from "fs"
import fetchData from "./fetchData.js"
import { removeCircularReferences } from "../helper.js"
import cleanData from "./cleaner.js"
import getLeagues from "./getLeagues.js"


const getData = async (writeToFile = false) => {
    // const response = await fetchData()

    await getLeagues()

    // if (writeToFile) {
    //     fs.writeFileSync("../../data/pinnacle/matchups.json", JSON.stringify(response, removeCircularReferences(), "\t"))
    // }

    // const matchups = cleanData(response.data)

    // return matchups
}

export default getData
